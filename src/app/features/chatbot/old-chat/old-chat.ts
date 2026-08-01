import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { ApiChatMessage, ChatService } from '../chat.service';
import { MarkdownComponent } from 'ngx-markdown';

interface ChatMessage {
    role: 'user' | 'agent';
    text: string;
}

interface GeneratedDocument {
    id: number;
    title: string;
    type: string;
    description: string;
    updatedAt: string;
    icon: string;
}

interface DocumentComment {
    author: string;
    initials: string;
    text: string;
    meta: string;
}

@Component({
    selector: 'app-old-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TextareaModule, MenuModule, TagModule, FileUploadModule, MarkdownComponent],
    templateUrl: './old-chat.html',
    styleUrl: './old-chat.scss'
})
export class OldChat implements OnInit, OnDestroy {
    private currentChatId: string | null = null;
    markdownText = [
        '# PrimeNG Documentation',
        '',
        'Generated: 2026-03-04',
        '',
        '```typescript',
        "import { ApplicationConfig } from '@angular/core';",
        "import { providePrimeNG } from 'primeng/config';",
        "import Aura from '@primeuix/themes/aura';",
        '',
        'export const appConfig: ApplicationConfig = {',
        '    providers: [',
        '        providePrimeNG({',
        '            theme: {',
        '                preset: Aura',
        '            }',
        '        })',
        '    ]',
        '};',
        '```'
    ].join('\n');


    @ViewChild('chatHistoryBody') private chatHistoryBody?: ElementRef<HTMLDivElement>;

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly renderer: Renderer2,
        private readonly chatService: ChatService,
        private readonly ngZone: NgZone,
        private readonly changeDetector: ChangeDetectorRef
    ) {
        this.route.paramMap.subscribe((params) => {
            const chatId = params.get('id');
            const initialPrompt = this.route.snapshot.queryParamMap.get('prompt');
            if (chatId && chatId !== this.currentChatId) {
                void this.loadConversation(chatId, initialPrompt);
            }
        });
    }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'is-fullscreen-chat');
        this.updateDocumentOptions();
        this.updateCommentViewOptions();
    }

    ngAfterViewInit(): void {
        this.scrollChatHistoryToBottom();
    }

    chatTitle = 'Tổng hợp và phân tích văn bản pháp luật';

    chatInput = '';

    selectedModel = 'qwen3:4b-instruct';

    modelOptions: MenuItem[] = [
        { label: 'qwen3:4b-instruct', command: () => this.selectModel('qwen3:4b-instruct') },
        { label: 'GPT-4o', command: () => this.selectModel('GPT-4o') },
        { label: 'Claude 3.5 Sonnet', command: () => this.selectModel('Claude 3.5 Sonnet') },
        { label: 'Gemini 2.0 Flash', command: () => this.selectModel('Gemini 2.0 Flash') }
    ];

    selectedTools: string[] = [];

    isGenerating = false;

    activityLabel = '';

    activityStep = 0;

    messages: ChatMessage[] = [];
    errorMessage = '';
    isLoadingConversation = true;

    generatedDocuments: GeneratedDocument[] = [
        { id: 1, title: 'Báo cáo tổng hợp nội dung', type: 'DOCX', description: 'Tóm lược các luận điểm và thông tin quan trọng trong tài liệu.', updatedAt: 'Vừa tạo', icon: 'pi pi-file-word' },
        { id: 2, title: 'Bảng phân tích điểm chính', type: 'XLSX', description: 'Các dữ liệu được nhóm và sắp xếp để dễ dàng theo dõi.', updatedAt: 'Vừa tạo', icon: 'pi pi-table' },
        { id: 3, title: 'Bản tóm tắt cho lãnh đạo', type: 'PDF', description: 'Phiên bản ngắn gọn, sẵn sàng để chia sẻ và phê duyệt.', updatedAt: 'Vừa tạo', icon: 'pi pi-file-pdf' }
    ];

    selectedDocument: GeneratedDocument | null = null;
    isDocumentOpen = false;

    documentOptions: MenuItem[] = [];

    updateDocumentOptions(): void {
        this.documentOptions = this.generatedDocuments.map((doc) => ({
            label: `${doc.title} (${doc.type})`,
            icon: doc.id === this.selectedDocument?.id ? 'pi pi-check' : undefined,
            command: () => this.selectDocument(doc)
        }));
    }

    comments: DocumentComment[] = [
        { author: 'Nguyễn Minh', initials: 'NM', text: 'Nên bổ sung nguồn tham chiếu cho số liệu ở phần này.', meta: '10 phút trước · Trang 2' },
        { author: 'Trợ lý AI', initials: 'AI', text: 'Đã đánh dấu để bạn kiểm tra lại trước khi xuất bản.', meta: 'Vừa xong · Trang 3' },
        { author: 'Lê Anh', initials: 'LA', text: 'Cách diễn đạt này đã rõ ràng và phù hợp với văn phong chung.', meta: '5 phút trước · Trang 4' }
    ];

    selectedCommentView = 'Nhận xét';
    commentViewOptions: MenuItem[] = [];

    updateCommentViewOptions(): void {
        const views = ['Nhận xét', 'Văn bản tham chiếu'];
        this.commentViewOptions = views.map((view) => ({
            label: view,
            icon: view === this.selectedCommentView ? 'pi pi-check' : undefined,
            command: () => this.selectCommentView(view)
        }));
    }

    selectCommentView(view: string): void {
        this.selectedCommentView = view;
        this.updateCommentViewOptions();
    }

    private generationTimer?: ReturnType<typeof setInterval>;

    tools: MenuItem[] = [
        { label: 'Tìm kiếm web', icon: 'pi pi-globe', command: () => this.addTool('Tìm kiếm web') },
        { label: 'Phân tích dữ liệu', icon: 'pi pi-chart-bar', command: () => this.addTool('Phân tích dữ liệu') },
        { label: 'Tải tệp lên', icon: 'pi pi-paperclip', command: () => this.addTool('Tải tệp lên') },
        { label: 'Tổng hợp báo cáo', icon: 'pi pi-file-edit', command: () => this.addTool('Tổng hợp báo cáo') },
        { label: 'Tóm tắt văn bản', icon: 'pi pi-align-left', command: () => this.addTool('Tóm tắt văn bản') },
        { label: 'Đánh giá văn bản', icon: 'pi pi-search', command: () => this.addTool('Đánh giá văn bản') },
        { label: 'Brainstorm ý tưởng', icon: 'pi pi-lightbulb', command: () => this.addTool('Brainstorm ý tưởng') },
        { label: 'Dịch thuật', icon: 'pi pi-language', command: () => this.addTool('Dịch thuật') },
        { label: 'Viết và sửa code', icon: 'pi pi-code', command: () => this.addTool('Viết và sửa code') }
    ];

    addTool(tool: string): void {
        if (!this.selectedTools.includes(tool)) {
            this.selectedTools.push(tool);
        }
    }

    removeTool(tool: string): void {
        this.selectedTools = this.selectedTools.filter((selectedTool) => selectedTool !== tool);
    }

    selectModel(model: string): void {
        this.selectedModel = model;
    }

    resizePrompt(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        const maxHeight = 240;

        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }

    handleComposerKeydown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            this.sendMessage();
        }
    }

    sendMessage(): void {
        const prompt = this.chatInput.trim();
        if (!prompt || this.isGenerating) return;

        const requestMessages = this.toApiMessages([...this.messages, { role: 'user', text: prompt }]);
        const assistantIndex = this.messages.length + 1;
        this.messages = [...this.messages, { role: 'user', text: prompt }, { role: 'agent', text: '' }];
        this.chatInput = '';
        this.errorMessage = '';
        this.isGenerating = true;
        this.activityLabel = 'Đang soạn phản hồi';
        this.changeDetector.detectChanges();
        this.scrollChatHistoryToBottom();

        void this.sendChatMessage(requestMessages, assistantIndex);
    }

    selectDocument(document: GeneratedDocument): void {
        this.selectedDocument = document;
        this.isDocumentOpen = true;
        this.updateDocumentOptions();
    }

    closeDocument(): void {
        this.isDocumentOpen = false;
        setTimeout(() => {
            if (!this.isDocumentOpen) {
                this.selectedDocument = null;
            }
        }, 450);
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.body, 'is-fullscreen-chat');
        this.stopGeneration();
    }

    private startGeneration(): void {
        this.stopGeneration();
        this.isGenerating = true;
        this.activityStep = 0;
        this.activityLabel = 'Đang lập kế hoạch';

        const activities = ['Đang lập kế hoạch', 'Đang thực hiện bước 1/3', 'Đang thực hiện bước 2/3', 'Đang hoàn thiện văn bản'];
        this.generationTimer = setInterval(() => {
            this.activityStep += 1;
            if (this.activityStep < activities.length) {
                this.activityLabel = activities[this.activityStep];
                return;
            }

            this.stopGeneration();
            this.isGenerating = false;
            this.activityLabel = '';
            this.messages = [...this.messages, { role: 'agent', text: 'Mình đã hoàn tất và tạo các văn bản phù hợp với yêu cầu của bạn.' }];
        }, 850);
    }

    private async loadConversation(chatId: string, initialPrompt?: string | null): Promise<void> {
        this.stopGeneration();
        this.currentChatId = chatId;
        this.selectedDocument = null;
        this.chatInput = '';
        this.activityLabel = '';
        this.isGenerating = false;
        this.isLoadingConversation = true;
        this.errorMessage = '';
        let shouldSendInitialPrompt = false;

        try {
            const conversation = await this.chatService.getConversation(chatId);
            this.messages = conversation.messages
                .filter((message) => message.role === 'user' || message.role === 'assistant')
                .map((message) => ({ role: message.role === 'user' ? 'user' : 'agent', text: message.content }));

            shouldSendInitialPrompt = !!initialPrompt && !this.messages.some((message) => message.role === 'user' && message.text === initialPrompt);
        } catch (error) {
            console.error('Không thể tải cuộc trò chuyện', error);
            this.errorMessage = 'Không thể tải cuộc trò chuyện. Vui lòng thử lại.';
            this.messages = initialPrompt ? [{ role: 'user', text: initialPrompt }] : [];
            shouldSendInitialPrompt = !!initialPrompt;
        } finally {
            this.isLoadingConversation = false;
            this.changeDetector.detectChanges();
            this.scrollChatHistoryToBottom();
        }

        if (shouldSendInitialPrompt) {
            this.chatInput = initialPrompt ?? '';
            this.sendMessage();
        }
    }

    private async sendChatMessage(requestMessages: ApiChatMessage[], assistantIndex: number): Promise<void> {
        try {
            await this.chatService.sendChatWithStreaming(
                {
                    conversation_id: this.currentChatId,
                    messages: requestMessages,
                    model: this.selectedModel
                },
                (content) => {
                    this.ngZone.run(() => {
                        const updatedMessages = [...this.messages];
                        updatedMessages[assistantIndex] = { role: 'agent', text: `${updatedMessages[assistantIndex]?.text ?? ''}${content}` };
                        this.messages = updatedMessages;
                        this.changeDetector.detectChanges();
                        this.scrollChatHistoryToBottom();
                    });
                }
            );
        } catch (error) {
            console.error('Không thể gửi tin nhắn', error);
            this.ngZone.run(() => {
                this.messages = this.messages.filter((_, index) => index !== assistantIndex);
                this.errorMessage = 'Không thể nhận phản hồi. Vui lòng thử lại.';
                this.changeDetector.detectChanges();
                this.scrollChatHistoryToBottom();
            });
        } finally {
            this.ngZone.run(() => {
                this.isGenerating = false;
                this.activityLabel = '';
                this.changeDetector.detectChanges();
                this.scrollChatHistoryToBottom();
            });
        }
    }

    private toApiMessages(messages: ChatMessage[]): ApiChatMessage[] {
        return messages.map((message) => ({
            role: message.role === 'user' ? 'user' : 'assistant',
            content: message.text
        }));
    }

    private scrollChatHistoryToBottom(): void {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const history = this.chatHistoryBody?.nativeElement;
                if (history) {
                    history.scrollTo({ top: history.scrollHeight, behavior: 'auto' });
                }
            });
        });
    }

    private stopGeneration(): void {
        if (this.generationTimer) {
            clearInterval(this.generationTimer);
            this.generationTimer = undefined;
        }
    }
}

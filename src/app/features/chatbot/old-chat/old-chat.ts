import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';

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
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TextareaModule, MenuModule, TagModule, FileUploadModule],
    templateUrl: './old-chat.html',
    styleUrl: './old-chat.scss'
})
export class OldChat implements OnInit, OnDestroy {
    private currentChatId: string | null = null;

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly renderer: Renderer2
    ) {
        this.route.queryParamMap.subscribe((params) => {
            const chatId = params.get('chatID');
            const initialPrompt = params.get('prompt');
            if (chatId && chatId !== this.currentChatId) {
                this.loadChat(chatId, initialPrompt);
            }
        });
    }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'is-fullscreen-chat');
        this.updateDocumentOptions();
        this.updateCommentViewOptions();
    }

    chatTitle = 'Tổng hợp và phân tích văn bản pháp luật';

    chatInput = '';

    selectedModel = 'GPT-4o';

    modelOptions: MenuItem[] = [
        { label: 'GPT-4o', command: () => this.selectModel('GPT-4o') },
        { label: 'Claude 3.5 Sonnet', command: () => this.selectModel('Claude 3.5 Sonnet') },
        { label: 'Gemini 2.0 Flash', command: () => this.selectModel('Gemini 2.0 Flash') }
    ];

    selectedTools: string[] = [];

    isGenerating = false;

    activityLabel = '';

    activityStep = 0;

    messages: ChatMessage[] = [];

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

    sendMessage(): void {
        const prompt = this.chatInput.trim();
        if (!prompt || this.isGenerating) return;

        this.messages = [...this.messages, { role: 'user', text: prompt }];
        this.chatInput = '';
        this.startGeneration();
    }

    selectDocument(document: GeneratedDocument): void {
        this.selectedDocument = document;
        this.updateDocumentOptions();
        requestAnimationFrame(() => {
            this.isDocumentOpen = true;
        });
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

    private loadChat(chatId: string, initialPrompt?: string | null): void {
        this.stopGeneration();
        this.currentChatId = chatId;
        this.selectedDocument = null;
        this.chatInput = '';
        this.activityLabel = '';
        this.isGenerating = false;

        if (initialPrompt) {
            this.messages = [{ role: 'user', text: initialPrompt }];
            this.startGeneration();
        } else {
            this.messages = [
                { role: 'user', text: 'Hãy tổng hợp nội dung chính và tạo giúp tôi bộ văn bản cần thiết.' },
                { role: 'agent', text: 'Mình đã hoàn tất và tạo các văn bản phù hợp với yêu cầu của bạn.' }
            ];
        }
    }

    private stopGeneration(): void {
        if (this.generationTimer) {
            clearInterval(this.generationTimer);
            this.generationTimer = undefined;
        }
    }
}

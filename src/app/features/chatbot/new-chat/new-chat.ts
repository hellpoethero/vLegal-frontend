import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { ChatService } from '../chat.service';

@Component({
    selector: 'app-new-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TextareaModule, MenuModule, TagModule, FileUploadModule],
    templateUrl: './new-chat.html',
    styleUrl: './new-chat.scss'
})
export class NewChat {
    constructor(
        private readonly router: Router,
        private readonly chatService: ChatService
    ) { }

    chatInput = '';

    selectedModel = 'qwen3:4b-instruct';

    modelOptions: MenuItem[] = [
        { label: 'qwen3:4b-instruct', command: () => this.selectModel('qwen3:4b-instruct') },
        { label: 'GPT-4o', command: () => this.selectModel('GPT-4o') },
        { label: 'Claude 3.5 Sonnet', command: () => this.selectModel('Claude 3.5 Sonnet') },
        { label: 'Gemini 2.0 Flash', command: () => this.selectModel('Gemini 2.0 Flash') }
    ];

    selectedTools: string[] = [];

    activeTask: string | null = null;

    selectedDataSource: string | null = null;

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

    tasks = [
        { icon: 'pi pi-file-edit', title: 'Tổng hợp báo cáo', description: 'Chắt lọc điểm chính từ nhiều tài liệu' },
        { icon: 'pi pi-align-left', title: 'Tóm tắt văn bản', description: 'Rút gọn nội dung nhanh chóng, dễ hiểu' },
        { icon: 'pi pi-search', title: 'Đánh giá văn bản', description: 'Phân tích, nhận xét và đề xuất cải thiện' },
        { icon: 'pi pi-lightbulb', title: 'Brainstorm ý tưởng', description: 'Khơi nguồn ý tưởng cho dự án mới' },
        { icon: 'pi pi-language', title: 'Dịch thuật', description: 'Dịch nội dung tự nhiên và chính xác' },
        { icon: 'pi pi-code', title: 'Viết và sửa code', description: 'Giải thích hoặc tối ưu mã nguồn' }
    ];

    useTask(title: string): void {
        this.chatInput = title;
        this.activeTask = title;
        this.selectedDataSource = null;
        this.selectedTools = this.selectedTools.filter((tool) => !this.tasks.some((task) => task.title === tool));
        this.selectedTools.push(title);
    }

    cancelTask(): void {
        if (this.activeTask) {
            this.selectedTools = this.selectedTools.filter((tool) => tool !== this.activeTask);
        }
        this.activeTask = null;
        this.selectedDataSource = null;
    }

    chooseDataSource(source: string): void {
        this.selectedDataSource = source;
    }

    addTool(tool: string): void {
        if (!this.selectedTools.includes(tool)) {
            this.selectedTools.push(tool);
        }
    }

    removeTool(tool: string): void {
        if (this.activeTask === tool) {
            this.cancelTask();
            return;
        }

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
            void this.sendMessage();
        }
    }

    isSubmitting = false;
    errorMessage = '';

    async sendMessage(): Promise<void> {
        const prompt = this.chatInput.trim();
        if (!prompt || this.isSubmitting) return;

        this.isSubmitting = true;
        this.errorMessage = '';

        try {
            const conversation = await this.chatService.createConversation(prompt.slice(0, 200));
            await this.router.navigate(['/chat', conversation.id], {
                queryParams: { prompt }
            });
        } catch (error) {
            console.error('Không thể gửi tin nhắn mới', error);
            this.errorMessage = 'Không thể gửi yêu cầu. Vui lòng thử lại.';
            this.isSubmitting = false;
        }
    }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'app-new-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, MenuModule, TagModule, FileUploadModule],
    templateUrl: './new-chat.html',
    styleUrl: './new-chat.scss'
})
export class NewChat {
    chatInput = '';

    selectedModel = 'GPT-4o';

    modelOptions: MenuItem[] = [
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
        { label: 'Tải tệp lên', icon: 'pi pi-paperclip', command: () => this.addTool('Tải tệp lên') }
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

    sendMessage(): void {
        if (!this.chatInput.trim()) return;
        console.log('Starting chat:', { message: this.chatInput.trim(), model: this.selectedModel, tools: this.selectedTools });
    }
}

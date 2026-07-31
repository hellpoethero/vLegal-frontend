import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TiptapEditorDirective } from 'ngx-tiptap';

@Component({
    selector: 'app-editor',
    imports: [TiptapEditorDirective, RouterLink, CommonModule, FormsModule,],
    templateUrl: './editor.html',
    styleUrl: './editor.scss',
    standalone: true
})
export class DocumentEditor implements OnDestroy {
    editor = new Editor({
        extensions: [StarterKit],
    });

    value = '<p>Hello, Tiptap!</p>';

    ngOnDestroy(): void {
        this.editor.destroy();
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ApiChatMessage {
    role: ChatRole;
    content: string;
}

export interface ChatRequest {
    conversation_id?: string | null;
    messages: ApiChatMessage[];
    model?: string;
}

export interface ChatResponse {
    conversation_id: string;
    message_id?: string;
    role?: 'assistant';
    content: string;
    created_at?: string;
    model?: string;
}

export interface ConversationDetail {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    messages: ApiChatMessage[];
}

interface StreamError extends Error {
    status?: number;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
    private readonly apiUrl = 'http://localhost:8000/api/v1';

    constructor(private readonly http: HttpClient) {}

    createConversation(title: string): Promise<{ id: string; title: string }> {
        return firstValueFrom(this.http.post<{ id: string; title: string }>(`${this.apiUrl}/conversations`, { title }));
    }

    getConversation(conversationId: string): Promise<ConversationDetail> {
        return firstValueFrom(this.http.get<ConversationDetail>(`${this.apiUrl}/conversations/${encodeURIComponent(conversationId)}`));
    }

    sendChat(request: ChatRequest): Promise<ChatResponse> {
        return firstValueFrom(this.http.post<ChatResponse>(`${this.apiUrl}/chat/completions`, request));
    }

    /**
     * Sends a message through the streaming endpoint. The API contract does
     * not prescribe one stream format, so both SSE and newline-delimited JSON
     * are accepted. A normal completion is used when streaming is unavailable.
     */
    async sendChatWithStreaming(request: ChatRequest, onDelta: (content: string) => void): Promise<ChatResponse> {
        try {
            return await this.readStream(request, onDelta);
        } catch (error) {
            const streamError = error as StreamError;
            if (streamError.status !== 404 && streamError.status !== 405) {
                throw error;
            }

            const response = await this.sendChat(request);
            if (response.content) {
                onDelta(response.content);
            }
            return response;
        }
    }

    private async readStream(request: ChatRequest, onDelta: (content: string) => void): Promise<ChatResponse> {
        const response = await fetch(`${this.apiUrl}/chat/completions/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream, application/x-ndjson, application/json' },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            const error = new Error(`Chat stream failed with status ${response.status}`) as StreamError;
            error.status = response.status;
            throw error;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            const body = await response.text();
            return this.consumePayload(body, onDelta);
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';
        let metadata: Partial<ChatResponse> = {};

        const consumeLine = (line: string): void => {
            const payload = line.startsWith('data:') ? line.slice(5).trim() : line.trim();
            if (!payload || payload === '[DONE]') return;

            const parsed = this.parseChunk(payload);
            metadata = { ...metadata, ...parsed };
            if (!parsed.content) return;

            fullContent += parsed.content;
            onDelta(parsed.content);
        };

        while (true) {
            const { done, value } = await reader.read();
            buffer += decoder.decode(value, { stream: !done });

            let newlineIndex = buffer.indexOf('\n');
            while (newlineIndex >= 0) {
                consumeLine(buffer.slice(0, newlineIndex).replace(/\r$/, ''));
                buffer = buffer.slice(newlineIndex + 1);
                newlineIndex = buffer.indexOf('\n');
            }

            if (done) break;
        }

        if (buffer.trim()) consumeLine(buffer);

        return {
            conversation_id: String(metadata.conversation_id ?? request.conversation_id ?? ''),
            message_id: metadata.message_id,
            role: 'assistant',
            content: fullContent,
            created_at: metadata.created_at,
            model: metadata.model
        };
    }

    private consumePayload(payload: string, onDelta: (content: string) => void): ChatResponse {
        const parsed = this.parseChunk(payload.trim());
        if (parsed.content) onDelta(parsed.content);
        return {
            conversation_id: String(parsed.conversation_id ?? ''),
            message_id: parsed.message_id,
            role: 'assistant',
            content: parsed.content ?? '',
            created_at: parsed.created_at,
            model: parsed.model
        };
    }

    private parseChunk(payload: string): Partial<ChatResponse> {
        try {
            const value = JSON.parse(payload) as Record<string, unknown>;
            const delta = value['delta'];
            const message = value['message'];
            const choices = Array.isArray(value['choices']) ? value['choices'][0] : undefined;
            const choice = (typeof choices === 'object' && choices ? choices : {}) as Record<string, unknown>;
            const choiceDelta = choice['delta'];
            const nested = (typeof delta === 'object' && delta
                ? delta
                : typeof message === 'object' && message
                  ? message
                  : typeof choiceDelta === 'object' && choiceDelta
                    ? choiceDelta
                    : {}) as Record<string, unknown>;
            const content = value['content'] ?? nested['content'] ?? choice['text'];

            return {
                conversation_id: String(value['conversation_id'] ?? ''),
                message_id: String(value['message_id'] ?? ''),
                content: typeof content === 'string' ? content : '',
                created_at: String(value['created_at'] ?? ''),
                model: String(value['model'] ?? '')
            };
        } catch {
            return { content: payload };
        }
    }
}

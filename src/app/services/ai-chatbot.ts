import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Booking } from '../models/booking.model';

export interface ChatRequest {
  message: string;
  sessionId: string;
  expenses: Booking[];
}

export interface ChatResponse {
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class AiChatbotService {
  private http = inject(HttpClient);
  private webhookUrl = environment.aiAgentWebhookUrl;

  sendMessage(message: string, expenses: Booking[]) {
    const body: ChatRequest = {
      message: message,
      sessionId: 'user-session-1',
      expenses: expenses
    };

    return this.http.post<ChatResponse>(this.webhookUrl, body);
  }
}
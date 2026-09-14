import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiChatbotService } from '../../services/ai-chatbot';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class Chatbot {
  private aiService = inject(AiChatbotService);
  private bookingService = inject(BookingService);
  private auth = inject(AuthService);

  isChatOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  userMessage = signal<string>('');
  
  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am your Hotel Assistant. Ask me about your bookings or spending!' }
  ]);

  toggleChat() {
    this.isChatOpen.update(v => !v);
  }

  sendMessage() {
    const msg = this.userMessage().trim();
    if (!msg || this.isLoading()) return;

    this.messages.update(m => [...m, { sender: 'user', text: msg }]);
    this.userMessage.set('');
    this.isLoading.set(true);

    const currentUser = this.auth.currentUser();
    const userBookings = this.bookingService.bookings().filter(b => b.guestName === currentUser);
    console.log('Sending to n8n:', userBookings);

    this.aiService.sendMessage(msg, userBookings).subscribe({
      next: (res: any) => {
        const reply = res?.reply || 'Sorry, I could not process your request.';
        this.messages.update(m => [...m, { sender: 'bot', text: reply }]);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        const errorMsg = 'Error: Cannot connect to AI Agent. Please make sure n8n is running.';
        this.messages.update(m => [...m, { sender: 'bot', text: errorMsg }]);
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }
}
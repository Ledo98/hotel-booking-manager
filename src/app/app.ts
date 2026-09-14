import { Component, signal, effect, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Chatbot } from './components/chatbot/chatbot'; 
import { DOCUMENT } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Chatbot], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private document = inject(DOCUMENT);
  private router = inject(Router);
  auth = inject(AuthService);
  toast = inject(ToastService);

  isDarkMode = signal<boolean>(false);

  constructor() {
    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      this.document.body.setAttribute('data-bs-theme', theme);
    });
  }

  toggleTheme() {
    this.isDarkMode.update(mode => !mode);
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }
}
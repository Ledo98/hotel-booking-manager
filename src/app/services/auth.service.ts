import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<string | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('hotel_user');
    if (savedUser) {
      this.currentUser.set(savedUser);
    }
  }

  login(username: string) {
    if (username.trim()) {
      this.currentUser.set(username);
      localStorage.setItem('hotel_user', username);
    }
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('hotel_user');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
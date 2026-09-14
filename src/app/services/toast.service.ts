import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string | null>(null);
  isVisible = signal<boolean>(false);

  show(msg: string) {
    this.message.set(msg);
    this.isVisible.set(true);
    
    setTimeout(() => {
      this.isVisible.set(false);
    }, 3000);
  }
}
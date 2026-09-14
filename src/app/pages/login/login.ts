import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router); 

  username = signal('');
  errorMsg = signal('');

  login() {
    if (this.username().trim().length < 3) {
      this.errorMsg.set('Please enter a valid name (at least 3 characters)');
      return;
    }
    
    this.auth.login(this.username());
    this.router.navigate(['/']);
  }
}
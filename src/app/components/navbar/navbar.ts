import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  @Output() toggleDarkMode = new EventEmitter<void>();
  @Input() isDarkMode: boolean = false; 
  
  auth = inject(AuthService);
  private router = inject(Router); 

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    title: 'Login - Hotel Booking'
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    title: 'Home - Hotel Booking'
  },
  {
    path: 'contact',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/contact/contact').then(m => m.Contact),
    title: 'Support - Hotel Booking'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    title: 'Dashboard - Hotel Booking'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
    title: '404 - Page Not Found'
  }
];
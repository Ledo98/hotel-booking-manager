import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../models/booking.model';

export interface Hotel {
  id: number;
  name: string;
  stars: number;
  price: number; 
  imageUrl: string;
}

interface ToastServiceLike {
  show(message: string): void;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/bookings';
  private hotelsApiUrl = 'http://localhost:3000/hotels';
  private toastService: ToastServiceLike = {
    show: (message: string) => console.log(message)
  };

  bookings = signal<Booking[]>([]);
  editingId = signal<number | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  hotels = signal<Hotel[]>([]);

  loadBookings() {
    this.loading.set(true);
    this.http.get<Booking[]>(this.apiUrl).subscribe({
      next: (data) => {
        const normalized = data.map(b => ({ ...b, id: Number(b.id) }));
        this.bookings.set(normalized);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load bookings. Is json-server running?');
        this.loading.set(false);
      }
    });
  }

  loadHotels() {
    this.http.get<Hotel[]>(this.hotelsApiUrl).subscribe({
      next: (data) => this.hotels.set(data),
      error: (err) => console.error('Failed to load hotels', err)
    });
  }

  addBooking(booking: Omit<Booking, 'id'>) {
    this.http.post<Booking>(this.apiUrl, booking).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Failed to add booking', err)
    });
  }

  updateBooking(id: number, booking: Omit<Booking, 'id'>) {
    this.http.put<Booking>(`${this.apiUrl}/${id}`, booking).subscribe({
      next: () => {
        this.loadBookings();
        this.cancelEdit();
      },
      error: (err) => console.error('Failed to update booking', err)
    });
  }

  deleteBooking(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadBookings();
        this.toastService.show('Booking canceled and the amount will be refunded to your account.');
      },
      error: (err) => console.error('Failed to delete booking', err)
    });
  }

  startEdit(booking: Booking) {
    this.editingId.set(booking.id);
  }

  cancelEdit() {
    this.editingId.set(null);
  }
}
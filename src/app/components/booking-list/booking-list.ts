import { Component, Input, Output, EventEmitter, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Booking, RoomType } from '../../models/booking.model';
import { RoomTypeIconPipe } from '../../pipes/room-type-icon.pipe';
import { HighlightPremiumDirective } from '../../directives/highlight-premium.directive';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, RoomTypeIconPipe, HighlightPremiumDirective],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.css']
})
export class BookingList {
  @Input() set bookings(value: Booking[]) {
    this._bookings.set(value);
  }
  private _bookings = signal<Booking[]>([]);

  @Output() edit = new EventEmitter<Booking>();
  @Output() delete = new EventEmitter<number>();

  private auth = inject(AuthService); 

  roomFilter = signal<'All' | RoomType>('All');
  search = signal('');
  sortBy = signal<'checkIn' | 'price'>('checkIn');
  sortDir = signal<'asc' | 'desc'>('asc');

  roomTypes: ('All' | RoomType)[] = ['All', 'Single', 'Double', 'Suite', 'Deluxe', 'Family', 'Presidential'];

    filteredBookings = computed(() => {
    const currentUser = this.auth.currentUser();
    let result = this._bookings().filter(b => b.guestName === currentUser);

    if (this.roomFilter() !== 'All') {
      result = result.filter(b => b.roomType === this.roomFilter());
    }

    if (this.search().trim()) {
      const searchQuery = this.search().toLowerCase().trim();
      result = result.filter(b => 
        b.guestName?.toLowerCase().includes(searchQuery) || 
        b.hotelName?.toLowerCase().includes(searchQuery)
      );
    }

    result = [...result].sort((a, b) => {
      const valA = this.sortBy() === 'checkIn' ? new Date(a.checkIn).getTime() : a.price;
      const valB = this.sortBy() === 'checkIn' ? new Date(b.checkIn).getTime() : b.price;
      return this.sortDir() === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  });

  runningTotal = computed(() => {
    return this.filteredBookings().reduce((sum, b) => sum + Number(b.price), 0);
  });

  toggleSortDir() {
    this.sortDir.update(dir => dir === 'asc' ? 'desc' : 'asc');
  }
}
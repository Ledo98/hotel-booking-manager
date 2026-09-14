import { Component, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  private bookingService = inject(BookingService);
  auth = inject(AuthService);

  userBookings = computed(() => {
    const currentUser = this.auth.currentUser();
    return this.bookingService.bookings().filter(b => b.guestName === currentUser);
  });

  totalBookings = computed(() => this.userBookings().length);

  totalSpent = computed(() => this.userBookings().reduce((sum, b) => sum + b.price, 0));

  totalNights = computed(() => {
    return this.userBookings().reduce((sum, b) => {
      const checkIn = new Date(b.checkIn).getTime();
      const checkOut = new Date(b.checkOut).getTime();
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + (nights > 0 ? nights : 0);
    }, 0);
  });
}
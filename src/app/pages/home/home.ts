import { Component, inject, OnInit, signal } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingForm } from '../../components/booking-form/booking-form';
import { BookingList } from '../../components/booking-list/booking-list';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookingForm, BookingList],
  templateUrl: './home.html'
})
export class Home implements OnInit {
  private bookingService = inject(BookingService);

  bookings = this.bookingService.bookings;
  loading = this.bookingService.loading;
  error = this.bookingService.error;
  editingBooking = signal<Booking | null>(null);

  ngOnInit(): void {
    this.bookingService.loadBookings();
    this.bookingService.loadHotels(); 
  }

  onEdit(booking: Booking) {
    this.editingBooking.set(booking);
  }

  onSubmit(data: Omit<Booking, 'id'>) {
    const editingId = this.bookingService.editingId();
    if (editingId !== null) {
      this.bookingService.updateBooking(editingId, data);
    } else {
      this.bookingService.addBooking(data);
    }
    this.editingBooking.set(null);
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(id);
    }
  }

  onCancelEdit() {
    this.editingBooking.set(null);
    this.bookingService.cancelEdit();
  }
}
import { Component, Input, Output, EventEmitter, inject, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Booking, RoomType } from '../../models/booking.model';
import { AuthService } from '../../services/auth.service';
import { BookingService, Hotel } from '../../services/booking.service';

function checkoutAfterCheckin(group: AbstractControl): ValidationErrors | null {
  const checkIn = group.get('checkIn')?.value;
  const checkOut = group.get('checkOut')?.value;
  if (checkIn && checkOut && checkOut <= checkIn) {
    return { invalidDateRange: true };
  }
  return null;
}

const ROOM_CONFIG: Record<RoomType, { maxGuests: number, extraGuestFee: number }> = {
  'Single': { maxGuests: 1, extraGuestFee: 0 },
  'Double': { maxGuests: 2, extraGuestFee: 30 },
  'Suite': { maxGuests: 4, extraGuestFee: 50 },
  'Deluxe': { maxGuests: 3, extraGuestFee: 40 },
  'Family': { maxGuests: 5, extraGuestFee: 20 },
  'Presidential': { maxGuests: 6, extraGuestFee: 100 }
};

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css']
})
export class BookingForm {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private bookingService = inject(BookingService);

  hotels = this.bookingService.hotels;
  todayDate = new Date().toISOString().split('T')[0]; 

  @Input() set editingBooking(b: Booking | null) {
    if (b) {
      this.form.patchValue(b);
      this.selectedStars.set(b.stars);
      this.selectedHotelName.set(b.hotelName);
      this.isEditing = true;
    } else {
      this.resetForm();
      this.isEditing = false;
    }
  }

  @Output() formSubmit = new EventEmitter<Omit<Booking, 'id'>>();
  @Output() cancelEdit = new EventEmitter<void>();

  roomTypes = Object.keys(ROOM_CONFIG) as RoomType[];
  hotelStars = [1, 2, 3, 4, 5];
  isEditing = false;

  showCheckout = signal<boolean>(false);
  paymentSuccess = signal<boolean>(false);

  selectedHotelName = signal<string>('');
  selectedStars = signal<number>(4);
  maxGuests = signal<number>(1);
  basePrice = signal<number>(0);
  finalPrice = signal<number>(0);
  nights = signal<number>(0); 

  form: FormGroup = this.fb.group({
    guestName: [{ value: this.auth.currentUser(), disabled: true }, Validators.required],
    hotelName: ['', Validators.required],
    stars: [4, Validators.required],
    imageUrl: ['', Validators.required],
    roomType: ['Single', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]],
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    notes: ['', Validators.maxLength(200)]
  }, { validators: checkoutAfterCheckin });

  availableHotels = computed(() => {
    return this.hotels().filter(h => h.stars === this.selectedStars());
  });

  constructor() {
    this.form.get('stars')?.valueChanges.subscribe(stars => {
      this.selectedStars.set(Number(stars));
      this.form.get('hotelName')?.setValue('');
      this.form.get('imageUrl')?.setValue('');
      this.form.get('price')?.setValue(0);
      this.selectedHotelName.set('');
      this.basePrice.set(0);
      this.finalPrice.set(0);
      this.nights.set(0);
    });

    this.form.get('roomType')?.valueChanges.subscribe((room: RoomType) => {
      const config = ROOM_CONFIG[room];
      if (config) {
        this.maxGuests.set(config.maxGuests);
        const currentGuests = this.form.get('guests')?.value;
        if (currentGuests > config.maxGuests) {
          this.form.get('guests')?.setValue(config.maxGuests);
        } else {
          this.calculatePrice();
        }
      }
    });

    this.form.get('guests')?.valueChanges.subscribe(() => this.calculatePrice());
    
    this.form.get('checkIn')?.valueChanges.subscribe(() => this.calculatePrice());
    this.form.get('checkOut')?.valueChanges.subscribe(() => this.calculatePrice());
  }

  selectHotel(hotel: Hotel) {
    this.form.get('hotelName')?.setValue(hotel.name);
    this.form.get('imageUrl')?.setValue(hotel.imageUrl);
    this.form.get('price')?.setValue(hotel.price);
    this.basePrice.set(hotel.price);
    this.calculatePrice();
    this.selectedHotelName.set(hotel.name);
  }

  calculatePrice() {
    const roomType = this.form.get('roomType')?.value as RoomType;
    const guests = this.form.get('guests')?.value || 1;
    const base = this.basePrice();
    const checkIn = this.form.get('checkIn')?.value;
    const checkOut = this.form.get('checkOut')?.value;

    if (checkIn && checkOut && new Date(checkOut) > new Date(checkIn)) {
      const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.nights.set(diffDays);
    } else {
      this.nights.set(0);
    }

    if (roomType && base > 0 && this.nights() > 0) {
      const config = ROOM_CONFIG[roomType];
      const extraGuests = Math.max(0, guests - 1);
      const pricePerNight = base + (extraGuests * config.extraGuestFee);
      const total = pricePerNight * this.nights();
      this.finalPrice.set(total);
      this.form.get('price')?.setValue(total);
    } else {
      this.finalPrice.set(0);
      this.form.get('price')?.setValue(0);
    }
  }

  proceedToCheckout() {
    if (this.form.valid) {
      this.showCheckout.set(true);
      this.paymentSuccess.set(false);
    } else {
      this.form.markAllAsTouched();
    }
  }

  confirmPayment() {
    this.paymentSuccess.set(true);
    setTimeout(() => {
      const rawData = this.form.getRawValue(); 
      this.formSubmit.emit(rawData);
      this.showCheckout.set(false);
      this.paymentSuccess.set(false);
      this.resetForm();
    }, 2000);
  }

  closeCheckout() {
    this.showCheckout.set(false);
  }

  cancel() {
    this.cancelEdit.emit();
    this.resetForm();
    this.isEditing = false;
  }

  resetForm() {
    this.form.reset();
    this.form.get('guestName')?.setValue(this.auth.currentUser());
    this.form.get('stars')?.setValue(4);
    this.form.get('roomType')?.setValue('Single');
    this.form.get('guests')?.setValue(1);
    this.selectedStars.set(4);
    this.selectedHotelName.set('');
    this.maxGuests.set(1);
    this.basePrice.set(0);
    this.finalPrice.set(0);
    this.nights.set(0);
  }
}
import { Pipe, PipeTransform } from '@angular/core';
import { RoomType } from '../models/booking.model';

@Pipe({
  name: 'roomTypeIcon',
  standalone: true
})
export class RoomTypeIconPipe implements PipeTransform {
  transform(value: RoomType | string | null | undefined): string {
    if (!value) return '';

    const icons: Record<RoomType, string> = {
      'Single': '🛏️ Single',
      'Double': '🛌 Double',
      'Suite': '👑 Suite',
      'Deluxe': '💎 Deluxe',
      'Family': '👨‍👩‍👧 Family',
      'Presidential': '🏆 Presidential'
    };

    if (value in icons) {
      return icons[value as RoomType];
    }
    return value; 
  }
}
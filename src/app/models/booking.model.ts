// Define the available room types as a union type
export type RoomType = 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Family' | 'Presidential';

export interface Booking {
  id: number;
  guestName: string;
  hotelName: string;   
  stars: number;       
  imageUrl: string;   
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  price: number;
  notes?: string;
}
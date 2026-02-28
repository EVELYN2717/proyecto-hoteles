import { Injectable, signal } from '@angular/core';
import { Booking } from '../models/booking.model';
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly _bookings = signal<Booking[]>([]);

  readonly bookings = this._bookings.asReadonly();

  getById(id: string): Booking | undefined {
    return this._bookings().find(b => b.id === id);
  }

  getByHotelId(hotelId: string): Booking[] {
    return this._bookings().filter(b => b.hotelId === hotelId);
  }

  create(data: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const booking: Booking = {
      ...data,
      id: uuid(),
      createdAt: new Date().toISOString(),
    };
    this._bookings.update(list => [...list, booking]);
    return booking;
  }
}

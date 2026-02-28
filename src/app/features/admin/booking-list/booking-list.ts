import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { HotelService } from '../../../core/services/hotel.service';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-list',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.scss',
})
export class BookingListComponent {
  private readonly hotelService = inject(HotelService);
  protected readonly bookingService = inject(BookingService);

  protected readonly hotels = this.hotelService.hotels;
  protected readonly allBookings = this.bookingService.bookings;

  protected selectedHotelId = signal<string | null>(null);
  protected selectedBooking = signal<Booking | null>(null);

  protected filteredBookings = computed(() => {
    const hotelId = this.selectedHotelId();
    if (!hotelId) return this.allBookings();
    return this.bookingService.getByHotelId(hotelId);
  });

  selectHotel(hotelId: string): void {
    this.selectedHotelId.set(hotelId === this.selectedHotelId() ? null : hotelId);
    this.selectedBooking.set(null);
  }

  viewDetail(booking: Booking): void {
    this.selectedBooking.set(
      this.selectedBooking()?.id === booking.id ? null : booking,
    );
  }

  getHotelName(hotelId: string): string {
    return this.hotelService.getById(hotelId)?.name ?? 'Hotel desconocido';
  }
}

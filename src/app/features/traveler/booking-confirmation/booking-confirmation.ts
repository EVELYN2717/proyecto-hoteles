import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-booking-confirmation',
  imports: [RouterLink, CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './booking-confirmation.html',
  styleUrl: './booking-confirmation.scss',
})
export class BookingConfirmationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);

  protected booking = signal<Booking | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.bookingService.getById(id);
      if (found) {
        this.booking.set(found);
      } else {
        this.router.navigate(['/traveler/search']);
      }
    }
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HotelService } from '../../../core/services/hotel.service';
import { Hotel } from '../../../core/models/hotel.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-hotel-search',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './hotel-search.html',
  styleUrl: './hotel-search.scss',
})
export class HotelSearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly hotelService = inject(HotelService);

  protected readonly today = new Date().toISOString().split('T')[0];
  protected minCheckOut = signal(this.today);

  protected searchForm: FormGroup = this.fb.group({
    city: ['', Validators.required],
    checkIn: ['', Validators.required],
    checkOut: [''],
  });

  protected results = signal<Hotel[]>([]);
  protected searched = signal(false);

  onCheckInChange(): void {
    const checkIn = this.searchForm.get('checkIn')?.value;
    if (checkIn) {
      this.minCheckOut.set(checkIn);
      const checkOut = this.searchForm.get('checkOut')?.value;
      if (checkOut && checkOut < checkIn) {
        this.searchForm.get('checkOut')?.setValue('');
      }
    }
  }

  search(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const { city } = this.searchForm.value;
    const hotels = this.hotelService.searchByCity(city)
      .filter(h => h.rooms.length > 0 && h.rooms.some(r => r.isAvailable));
    this.results.set(hotels);
    this.searched.set(true);
  }

  starsArray(count: number): number[] {
    return Array.from({ length: count });
  }

  getMinPrice(hotel: Hotel): number {
    if (hotel.rooms.length === 0) return 0;
    const available = hotel.rooms.filter(r => r.isAvailable);
    if (available.length === 0) return 0;
    return Math.min(...available.map(r => r.baseCost + r.taxes));
  }

  getAvailableCount(hotel: Hotel): number {
    return hotel.rooms.filter(r => r.isAvailable).length;
  }
}

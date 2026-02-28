import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../core/services/hotel.service';
import { Hotel } from '../../../core/models/hotel.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-hotel-detail',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './hotel-detail.html',
  styleUrl: './hotel-detail.scss',
})
export class HotelDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hotelService = inject(HotelService);

  protected hotel = signal<Hotel | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.hotelService.getById(id);
      if (found && found.isActive) {
        this.hotel.set(found);
      } else {
        this.router.navigate(['/traveler/search']);
      }
    }
  }

  starsArray(count: number): number[] {
    return Array.from({ length: count });
  }
}

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HotelService } from '../../../core/services/hotel.service';
@Component({
  selector: 'app-hotel-list',
  imports: [RouterLink],
  templateUrl: './hotel-list.html',
  styleUrl: './hotel-list.scss',
})
export class HotelListComponent {
  protected readonly hotelService = inject(HotelService);

  starsArray(count: number): number[] {
    return Array.from({ length: count });
  }

  toggleActive(id: string): void {
    this.hotelService.toggleActive(id);
  }
}

import { Routes } from '@angular/router';

export const TRAVELER_ROUTES: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    loadComponent: () =>
      import('./hotel-search/hotel-search').then(m => m.HotelSearchComponent),
  },
  {
    path: 'hotel/:id',
    loadComponent: () =>
      import('./hotel-detail/hotel-detail').then(m => m.HotelDetailComponent),
  },
  {
    path: 'hotel/:id/room/:roomId/book',
    loadComponent: () =>
      import('./booking-form/booking-form').then(m => m.BookingFormComponent),
  },
  {
    path: 'booking-confirmation/:id',
    loadComponent: () =>
      import('./booking-confirmation/booking-confirmation').then(
        m => m.BookingConfirmationComponent,
      ),
  },
];

import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'hotels', pathMatch: 'full' },
  {
    path: 'hotels',
    loadComponent: () =>
      import('./hotel-list/hotel-list').then(m => m.HotelListComponent),
  },
  {
    path: 'hotels/new',
    loadComponent: () =>
      import('./hotel-form/hotel-form').then(m => m.HotelFormComponent),
  },
  {
    path: 'hotels/:id/edit',
    loadComponent: () =>
      import('./hotel-form/hotel-form').then(m => m.HotelFormComponent),
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('./booking-list/booking-list').then(m => m.BookingListComponent),
  },
];

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/hotels/:id/edit',
    renderMode: RenderMode.Client,
  },
  {
    path: 'traveler/hotel/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'traveler/hotel/:id/room/:roomId/book',
    renderMode: RenderMode.Client,
  },
  {
    path: 'traveler/booking-confirmation/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];

import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { RoleSelectComponent } from './features/role-select/role-select';

export const routes: Routes = [
  { path: '', component: RoleSelectComponent },
  {
    path: 'admin',
    canActivate: [roleGuard('admin')],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'traveler',
    canActivate: [roleGuard('traveler')],
    loadChildren: () =>
      import('./features/traveler/traveler.routes').then(m => m.TRAVELER_ROUTES),
  },
  { path: '**', redirectTo: '' },
];

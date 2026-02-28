import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoleState, UserRole } from '../../core/state/role.state';

@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.html',
  styleUrl: './role-select.scss',
})
export class RoleSelectComponent {
  private readonly router = inject(Router);
  private readonly roleState = inject(RoleState);

  selectRole(role: UserRole): void {
    this.roleState.setRole(role);
    const route = role === 'admin' ? '/admin/hotels' : '/traveler/search';
    this.router.navigate([route]);
  }
}

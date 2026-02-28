import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoleState } from '../../../core/state/role.state';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  protected readonly roleState = inject(RoleState);

  changeRole(): void {
    this.roleState.clearRole();
    this.router.navigate(['/']);
  }
}

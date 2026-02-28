import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleState, UserRole } from '../state/role.state';

export function roleGuard(expectedRole: UserRole): CanActivateFn {
  return () => {
    const roleState = inject(RoleState);
    const router = inject(Router);

    if (roleState.role() === expectedRole) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
}

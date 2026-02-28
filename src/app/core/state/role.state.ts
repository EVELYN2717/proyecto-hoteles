import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'admin' | 'traveler' | null;

@Injectable({ providedIn: 'root' })
export class RoleState {
  private readonly _role = signal<UserRole>(null);

  readonly role = this._role.asReadonly();
  readonly isAdmin = computed(() => this._role() === 'admin');
  readonly isTraveler = computed(() => this._role() === 'traveler');
  readonly hasRole = computed(() => this._role() !== null);

  setRole(role: UserRole): void {
    this._role.set(role);
  }

  clearRole(): void {
    this._role.set(null);
  }
}

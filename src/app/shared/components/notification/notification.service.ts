import { Injectable, signal } from '@angular/core';

const uuid = () => crypto.randomUUID();

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  success(message: string): void {
    this.add(message, 'success');
  }

  error(message: string): void {
    this.add(message, 'error');
  }

  info(message: string): void {
    this.add(message, 'info');
  }

  remove(id: string): void {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }

  private add(message: string, type: Notification['type']): void {
    const notification: Notification = { id: uuid(), message, type };
    this._notifications.update(list => [...list, notification]);

    setTimeout(() => this.remove(notification.id), 4000);
  }
}

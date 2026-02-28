import { Component, inject } from '@angular/core';
import { NotificationService, Notification } from './notification.service';

@Component({
  selector: 'app-notification',
  template: `
    @for (n of notificationService.notifications(); track n.id) {
      <div class="toast" [class]="'toast--' + n.type" (click)="notificationService.remove(n.id)">
        <span class="toast-icon">
          @switch (n.type) {
            @case ('success') { &#10003; }
            @case ('error') { &#10007; }
            @case ('info') { &#8505; }
          }
        </span>
        <span class="toast-message">{{ n.message }}</span>
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      top: 80px;
      right: 1rem;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 280px;
    }

    .toast--success {
      background: #ecfdf5;
      color: #065f46;
      border-left: 4px solid #10b981;
    }

    .toast--error {
      background: #fef2f2;
      color: #991b1b;
      border-left: 4px solid #ef4444;
    }

    .toast--info {
      background: #eff6ff;
      color: #1e40af;
      border-left: 4px solid #3b82f6;
    }

    .toast-icon { font-weight: 700; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
})
export class NotificationComponent {
  protected readonly notificationService = inject(NotificationService);
}

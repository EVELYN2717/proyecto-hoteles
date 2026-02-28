import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-container">
      <div class="spinner"></div>
      @if (message()) {
        <p class="spinner-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner-message {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
})
export class LoadingSpinnerComponent {
  message = input<string>('');
}

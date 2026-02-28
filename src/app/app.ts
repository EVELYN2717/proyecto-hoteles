import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { NotificationComponent } from './shared/components/notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}

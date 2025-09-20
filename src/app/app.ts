import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav';
import { HeaderComponent } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, BottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('manaapp-2.0');
}

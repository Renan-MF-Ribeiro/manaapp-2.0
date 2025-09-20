import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomePage {
  protected readonly ready = signal(true);
}

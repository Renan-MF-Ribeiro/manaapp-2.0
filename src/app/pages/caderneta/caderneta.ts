import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-caderneta',
  imports: [CommonModule],
  template: `<section class="p-4"><h2>Caderneta</h2></section>`,
  styles: [
    `
      h2 {
        margin: 0 0 0.5rem;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadernetaPage {}

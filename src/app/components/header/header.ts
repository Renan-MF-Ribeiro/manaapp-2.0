import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {}

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

type NavItem = { label: string; href: string; icon: string };

@Component({
  selector: 'app-bottom-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.html',
  styleUrls: ['./bottom-nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BottomNavComponent {
  private readonly router = inject(Router);

  protected readonly items: NavItem[] = [
    { label: 'Pedidos', href: '/orders', icon: '🧾' },
    { label: 'Produtos', href: '/products', icon: '📦' },
    { label: 'Caixa', href: '/cashflow', icon: '💰' },
    { label: 'Caderneta', href: '/caderneta', icon: '📒' },
    { label: 'Histórico', href: '/cash-history', icon: '📜' },
  ];

  protected readonly activeIndex = computed(() => {
    const url = this.router.url || '';
    const idx = this.items.findIndex((it) => url.startsWith(it.href));
    return idx >= 0 ? idx : 0;
  });
}

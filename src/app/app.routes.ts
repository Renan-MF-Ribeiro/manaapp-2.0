import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'cashflow', pathMatch: 'full' },
  {
    path: 'cashflow',
    loadComponent: () => import('./pages/cashflow/cashflow').then((m) => m.CashflowPage),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders').then((m) => m.OrdersPage),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then((m) => m.ProductsPage),
  },
  {
    path: 'caderneta',
    loadComponent: () => import('./pages/caderneta/caderneta').then((m) => m.CadernetaPage),
  },
  {
    path: 'cash-history',
    loadComponent: () => import('./pages/cash-history/cash-history').then((m) => m.CashHistoryPage),
  },
  { path: '**', redirectTo: 'cashflow' },
];

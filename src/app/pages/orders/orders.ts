import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AccordionModule } from 'primeng/accordion';
import { DrawerModule } from 'primeng/drawer';
import { CarouselModule } from 'primeng/carousel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrdersService } from '../../core/services/orders.service';
import { ProductsService } from '../../core/services/products.service';
import { ClientsService } from '../../core/services/clients.service';
import type { Order, OrderStatus, Payment, Product } from '../../core/models';
import { OrderStatusDisplay, PaymentMethodDisplay } from '../../core/models';
import { formatCurrency, parseCurrency } from '../../core/number.util';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    ToggleButtonModule,
    AccordionModule,
    DrawerModule,
    CarouselModule,
    AutoCompleteModule,
    InputNumberModule,
    FormsModule,
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly productsService = inject(ProductsService);
  private readonly clientsService = inject(ClientsService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly loading = signal(false);
  protected readonly orders = signal<Order[]>([]);
  protected readonly showPendingOnly = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly products = signal<Product[]>([]);
  protected readonly cart = signal<{ productId: string; qty: number }[]>([]);
  protected readonly editingOrder = signal<Order | null>(null);
  protected readonly numProductsVisible = computed(() => {
    return Math.min(3, this.products().length);
  });

  protected readonly payForm = this.fb.group({
    method: this.fb.control<'cash' | 'pix' | 'card' | 'tab'>('card', {
      validators: [Validators.required],
    }),
    amount: this.fb.control<number | null>(0, { validators: [Validators.min(0)] }),
    clientName: this.fb.control<string>(''),
  });

  protected readonly clientSuggestions = signal<string[]>([]);
  protected readonly OrderStatusDisplay = OrderStatusDisplay;
  protected readonly PaymentMethodDisplay = PaymentMethodDisplay;

  protected readonly filteredOrders = computed(() => {
    const list = this.orders();
    if (!this.showPendingOnly()) return list;
    return list.filter((o) => o.status === ('pending' as OrderStatus));
  });
  p: any;
  Math: any;

  ngOnInit() {
    this.refresh();
    this.productsService
      .listActive()
      .then((p) => this.products.set(p))
      .catch((e) => {
        console.error('Error loading active products:', e);
        this.products.set([]);
      });
  }

  protected fmt(v: number) {
    return formatCurrency(v);
  }

  protected createdAt(d: string) {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }

  protected async refresh() {
    this.loading.set(true);
    try {
      const list = await this.ordersService.list();
      // sort by createdAt desc
      list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      this.orders.set(list);
    } finally {
      this.loading.set(false);
    }
  }

  protected openNew() {
    this.editingOrder.set(null);
    this.cart.set([]);
    this.payForm.reset({ method: 'cash', amount: 0, clientName: '' });
    this.drawerOpen.set(true);
  }

  protected edit(o: Order) {
    this.editingOrder.set(o);
    this.cart.set(o.items ?? []);
    const first = o.payments?.[0];
    const method = (first && (first as any).method) || 'cash';
    this.payForm.reset({ method, amount: 0, clientName: o.clientName || '' });
    this.drawerOpen.set(true);
  }

  protected closeDrawer() {
    this.drawerOpen.set(false);
  }

  protected async remove(o: Order) {
    if (!confirm(`Remover pedido ${o.id}?`)) return;
    await this.ordersService.delete(o.id);
    await this.refresh();
  }

  protected total() {
    const map = new Map(this.products().map((p) => [p.id, p] as const));
    return this.cart().reduce((acc, it) => {
      const p = map.get(it.productId);
      return acc + (p ? p.price * it.qty : 0);
    }, 0);
  }

  protected previousPaymentsTotal() {
    const o = this.editingOrder();
    return o?.payments?.reduce((a, p) => a + (Number(p.amount) || 0), 0) ?? 0;
  }

  protected getProduct(id: string | undefined | null): Product | undefined {
    if (!id) return undefined;
    return this.products().find((p) => p.id === id);
  }

  protected addToCart(productId: string, qty = 1) {
    const current = this.cart();
    const found = current.find((x) => x.productId === productId);
    if (found) {
      this.cart.set(
        current.map((x) => (x.productId === productId ? { ...x, qty: x.qty + qty } : x))
      );
    } else {
      this.cart.set([...current, { productId, qty }]);
    }
  }

  protected removeOne(productId: string) {
    const current = this.cart();
    const found = current.find((x) => x.productId === productId);
    if (!found) return;
    if (found.qty <= 1) this.cart.set(current.filter((x) => x.productId !== productId));
    else
      this.cart.set(current.map((x) => (x.productId === productId ? { ...x, qty: x.qty - 1 } : x)));
  }

  protected async finalize() {
    const cart = this.cart();
    if (!cart.length) return alert('O carrinho está vazio');

    const fullTotal = this.total();
    const rawAmount = this.payForm.controls.amount.value;
    const entered = parseCurrency(rawAmount ?? 0);
    const clientName = (this.payForm.controls.clientName.value || '').trim();

    const editing = this.editingOrder();
    if (!editing && (!entered || entered <= 0)) {
      if (!clientName) return alert('Nome do cliente é obrigatório quando não há pagamento');
    }
    if (!clientName && entered < fullTotal) {
      return alert('Nome do cliente é obrigatório quando o valor é menor que o total');
    }

    const method = this.payForm.controls.method.value || 'cash';
    const payment: any = {
      id: Math.random().toString(36).slice(2, 9),
      method,
      amount: entered,
      createdAt: new Date().toISOString(),
    };

    const clientId = await this.getOrCreateClientId(clientName);
    if (clientId) payment.clientId = clientId;

    const payments = editing ? [...(editing.payments || []), payment] : [payment];
    const totalPaid = payments.reduce((a: number, p: any) => a + (Number(p.amount) || 0), 0);
    const status: OrderStatus = (totalPaid >= fullTotal ? 'paid' : 'pending') as OrderStatus;

    const order: Order = {
      id: editing?.id || crypto.randomUUID(),
      items: cart,
      payments,
      status,
      total: fullTotal,
      clientName,
      createdAt: editing?.createdAt || new Date().toISOString(),
    } as Order;

    if (editing) await this.ordersService.update(order);
    else await this.ordersService.save(order);

    // reset
    this.cart.set([]);
    this.payForm.reset({ method: 'cash', amount: 0, clientName: '' });
    this.editingOrder.set(null);
    this.drawerOpen.set(false);
    await this.refresh();
  }

  protected async removePayment(order: Order, paymentId: string) {
    if (!confirm('Remover pagamento?')) return;
    const updatedPayments = (order.payments || []).filter((p) => p.id !== paymentId);
    const totalPaid = updatedPayments.reduce((a, p) => a + (Number(p.amount) || 0), 0);
    const status: OrderStatus = (totalPaid >= order.total ? 'paid' : 'pending') as OrderStatus;
    await this.ordersService.update({ ...order, payments: updatedPayments, status });
    await this.refresh();
  }

  protected async completeClients(query: string) {
    const q = (query || '').toLowerCase();
    const list = await this.clientsService.list();
    const suggestions = list.filter((c) => c.name?.toLowerCase().includes(q)).map((c) => c.name);
    this.clientSuggestions.set(suggestions);
  }

  private async getOrCreateClientId(name: string): Promise<string | undefined> {
    const n = (name || '').trim();
    if (!n) return undefined;
    const list = await this.clientsService.list();
    const existing = list.find((c) => c.name.trim().toLowerCase() === n.toLowerCase());
    if (existing) return existing.id;
    return this.clientsService.save({ name: n, createdAt: new Date().toISOString() } as any) as any;
  }

  paymentsTotal(payments: Payment[]): number {
    return payments.reduce((total, payment) => total + (payment.amount || 0), 0);
  }
}

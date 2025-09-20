import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import type { Product } from '../../core/models';
import { formatCurrency } from '../../core/number.util';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, DrawerModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProductsPage implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly editMode = signal(false);
  protected readonly products = signal<Product[]>([]);
  protected readonly showDialog = signal(false);
  protected readonly showSheet = signal(false);
  private editingId: string | null = null;

  protected readonly form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
    price: this.fb.control<number>(0, { validators: [Validators.required, Validators.min(0)] }),
    active: this.fb.control<boolean>(true),
  });

  ngOnInit() {
    this.refresh();
  }

  protected fmt(v: number) {
    return formatCurrency(v);
  }

  protected async refresh() {
    this.loading.set(true);
    try {
      const list = await this.productsService.list();
      this.products.set(list);
    } finally {
      this.loading.set(false);
    }
  }

  protected onNew() {
    this.editMode.set(false);
    this.editingId = null;
    this.form.reset({ name: '', price: 0, active: true });
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      this.showSheet.set(true);
    } else {
      this.showDialog.set(true);
    }
  }

  protected onEdit(p: Product) {
    this.editMode.set(true);
    this.editingId = p.id;
    const activeBool = !(p.active === 'false' || p.active === false);
    this.form.reset({ name: p.name, price: p.price, active: activeBool });
  }

  protected async onDelete(p: Product) {
    if (!confirm(`Excluir o produto "${p.name}"?`)) return;
    await this.productsService.delete(p.id);
    await this.refresh();
    if (this.editingId === p.id) this.onNew();
  }

  protected onCancelEdit() {
    this.onNew();
  }

  protected async onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    try {
      const { name, price, active } = this.form.getRawValue();
      if (this.editMode() && this.editingId) {
        await this.productsService.update({
          id: this.editingId,
          name,
          price,
          active: active ? 'true' : 'false',
          createdAt: new Date().toISOString(),
        } as Product);
      } else {
        await this.productsService.save({ name, price, active });
        this.showDialog.set(false);
        this.showSheet.set(false);
      }
      await this.refresh();
      this.onNew();
    } finally {
      this.saving.set(false);
    }
  }
}

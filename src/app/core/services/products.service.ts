import { Injectable } from '@angular/core';
import { getTable } from '../db';
import type { Product } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  async list(): Promise<Product[]> {
    const table = await getTable('product');
    return table.toArray();
  }

  async listActive(): Promise<Product[]> {
    const table = await getTable('product');
    // Stored as string for compatibility with existing data
    return table.where('active').equals('true').toArray();
  }

  async save(product: {
    id?: string;
    name: string;
    price: number;
    active?: boolean | 'true' | 'false';
    createdAt?: string;
  }): Promise<string> {
    const createdAt = product.createdAt ?? new Date().toISOString();
    const id = product.id || crypto.randomUUID();
    const item: Product = {
      ...product,
      id,
      createdAt,
      active: product.active ? 'true' : 'false',
    };
    const table = await getTable('product');
    return table.add(item);
  }

  async update(product: Product) {
    const table = await getTable('product');
    return table.put(product);
  }

  async delete(id: string) {
    const table = await getTable('product');
    return table.delete(id);
  }
}

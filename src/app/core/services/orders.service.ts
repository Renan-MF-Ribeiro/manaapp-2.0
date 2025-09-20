import { Injectable } from '@angular/core';
import { getTable } from '../db';
import type { Order } from '../models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  async list(): Promise<Order[]> {
    const table = await getTable('order');
    return table.toArray();
  }

  async save(order: Omit<Order, 'id'> & { id?: string }) {
    const createdAt = order.createdAt || new Date().toISOString();
    const id = order.id || crypto.randomUUID();
    const item: Order = { ...(order as any), id, createdAt };
    const table = await getTable('order');
    return table.add(item);
  }

  async update(order: Order) {
    const table = await getTable('order');
    return table.put(order);
  }

  async delete(id: string) {
    const table = await getTable('order');
    return table.delete(id);
  }

  async registerPayment(
    orderId: string,
    paymentInput: { method: string; amount: number; clientId?: string }
  ) {
    const table = await getTable('transaction');
    const payment = { ...paymentInput, orderId, createdAt: new Date().toISOString() };
    return table.add(payment);
  }
}

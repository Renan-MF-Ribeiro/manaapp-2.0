import { Injectable } from '@angular/core';
import { getTable } from '../db';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  async save(tx: any) {
    const table = await getTable('transaction');
    return table.add(tx);
  }

  async list() {
    const table = await getTable('transaction');
    return table.toArray();
  }
}

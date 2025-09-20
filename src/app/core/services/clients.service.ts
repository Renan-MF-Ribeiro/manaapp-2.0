import { Injectable } from '@angular/core';
import { getTable } from '../db';
import type { Client } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  async list(): Promise<Client[]> {
    const table = await getTable('client');
    return table.toArray();
  }

  async save(client: Omit<Client, 'id'> & { id?: string }) {
    const createdAt = client.createdAt || new Date().toISOString();
    const id = client.id || crypto.randomUUID();
    const item: Client = { ...(client as any), id, createdAt };
    const table = await getTable('client');
    return table.add(item);
  }

  async update(client: Client) {
    const table = await getTable('client');
    return table.put(client);
  }

  async delete(id: string) {
    const table = await getTable('client');
    return table.delete(id);
  }
}

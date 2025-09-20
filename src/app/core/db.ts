let _db: any = null;

export async function getDatabase(): Promise<any> {
  if (_db) return _db;
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    throw new Error('IndexedDB is not available');
  }

  const { default: Dexie } = await import('dexie');

  const db: any = new Dexie('manapp');
  db.version(1).stores({
    product: 'id,createdAt,name,price,active',
    order: 'id,createdAt,clientId,clientName,status,total',
    client: 'id,createdAt,name,totalSpent,orders',
    transaction: '++id,createdAt,method,amount,clientId,orderId',
    client_payment: 'id,clientId,createdAt',
    cash_history: 'id,date,createdAt',
    meta: 'key',
  });
  db.open();
  _db = db;
  return _db;
}

export async function getTable(name: string): Promise<any> {
  if (!_db) await getDatabase();
  return _db.table(name);
}

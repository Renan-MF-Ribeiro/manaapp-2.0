export type Product = {
  id: string;
  name: string;
  price: number;
  active?: 'true' | 'false' | boolean;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  qty: number;
};

export type PaymentMethod = 'cash' | 'pix' | 'card' | 'tab';

export type Payment = {
  id: string;
  method: PaymentMethod;
  amount: number;
  createdAt: string;
  clientId: string;
  orderId?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  payments: Payment[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  clientName?: string;
};

export type Client = {
  id: string;
  name: string;
  totalSpent?: number;
  debts?: number;
  orders?: string[];
  createdAt: string;
};

export enum OrderStatus {
  pending = 'pending',
  paid = 'paid',
}

export enum OrderStatusDisplay {
  pending = 'Pendente',
  paid = 'Pago',
}

export enum PaymentMethodDisplay {
  cash = 'Dinheiro',
  pix = 'Pix',
  card = 'Cartão',
  tab = 'Caderneta',
}

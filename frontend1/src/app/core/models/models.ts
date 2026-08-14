export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: Address;
  itemsTotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: { status: string; note?: string; at: string }[];
  createdAt: string;
  user?: { name: string; email: string } | string;
}

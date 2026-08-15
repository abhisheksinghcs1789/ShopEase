import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments';
import { Address, Order } from '../models/models';

interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createRazorpayOrder(amount: number): Observable<RazorpayOrderResponse> {
    return this.http.post<RazorpayOrderResponse>(`${environment.apiUrl}/payment/create-order`, { amount });
  }

  placeOrder(payload: {
    shippingAddress: Address;
    paymentMethod: 'razorpay' | 'cod';
    razorpay?: { orderId: string; paymentId: string; signature: string };
  }): Observable<Order> {
    return this.http.post<Order>(this.base, payload);
  }

  myOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/my`);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  // ---- admin ----

  allOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.base);
  }

  updateStatus(id: string, status: string, note?: string): Observable<Order> {
    return this.http.patch<Order>(`${this.base}/${id}/status`, { status, note });
  }
}

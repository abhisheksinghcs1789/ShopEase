import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments';
import { CartItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private base = `${environment.apiUrl}/cart`;

  // Signal so the navbar's item-count badge updates the instant the cart changes,
  // without every component needing its own subscription.
  items = signal<CartItem[]>([]);

  constructor(private http: HttpClient) {}

  get itemCount() {
    return this.items().reduce((sum, i) => sum + i.quantity, 0);
  }

  get subtotal() {
    return this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  load() {
    return this.http.get<CartItem[]>(this.base).pipe(tap((items) => this.items.set(items)));
  }

  add(productId: string, quantity = 1) {
    return this.http
      .post<CartItem[]>(this.base, { productId, quantity })
      .pipe(tap((items) => this.items.set(items)));
  }

  updateQuantity(productId: string, quantity: number) {
    return this.http
      .put<CartItem[]>(`${this.base}/${productId}`, { quantity })
      .pipe(tap((items) => this.items.set(items)));
  }

  remove(productId: string) {
    return this.http
      .delete<CartItem[]>(`${this.base}/${productId}`)
      .pipe(tap((items) => this.items.set(items)));
  }

  clearLocal() {
    this.items.set([]);
  }
}

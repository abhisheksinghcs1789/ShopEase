import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  loading = true;
  readonly shippingFee = 49;

  constructor(public cart: CartService) {}

  ngOnInit() {
    this.cart.load().subscribe(() => (this.loading = false));
  }

  changeQty(item: CartItem, delta: number) {
    const next = item.quantity + delta;
    if (next < 1) return;
    if (next > item.product.stock) return;
    this.cart.updateQuantity(item.product._id, next).subscribe();
  }

  remove(item: CartItem) {
    this.cart.remove(item.product._id).subscribe();
  }

  get total() {
    return this.cart.subtotal + (this.cart.items().length ? this.shippingFee : 0);
  }
}

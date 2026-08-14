import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Address } from '../../core/models/models';

declare const Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  readonly shippingFee = 49;
  placing = false;
  error = '';

  address: Address = { line1: '', line2: '', city: '', state: '', pincode: '', phone: '' };
  paymentMethod: 'razorpay' | 'cod' = 'razorpay';

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.cart.items().length === 0) {
      this.cart.load().subscribe();
    }
  }

  get total() {
    return this.cart.subtotal + this.shippingFee;
  }

  get formValid() {
    const a = this.address;
    return a.line1 && a.city && a.state && a.pincode && a.phone;
  }

  placeOrder() {
    if (!this.formValid) {
      this.error = 'Please fill in all the required address fields.';
      return;
    }
    this.error = '';
    this.placing = true;

    if (this.paymentMethod === 'cod') {
      this.finalizeOrder();
      return;
    }

    // Razorpay flow: get an order id from our backend, open the widget,
    // then confirm the order only after Razorpay hands back a signed payment.
    this.orderService.createRazorpayOrder(this.total).subscribe({
      next: (rp) => {
        const options = {
          key: rp.keyId,
          amount: rp.amount,
          currency: rp.currency,
          name: 'ShopEase',
          description: 'Order payment',
          order_id: rp.orderId,
          prefill: { name: this.auth.currentUser()?.name, email: this.auth.currentUser()?.email },
          theme: { color: '#2f5233' },
          handler: (response: any) => {
            this.finalizeOrder({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => (this.placing = false),
          },
        };
        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: () => {
        this.error = 'Could not start payment. Please try again.';
        this.placing = false;
      },
    });
  }

  private finalizeOrder(razorpay?: { orderId: string; paymentId: string; signature: string }) {
    this.orderService
      .placeOrder({ shippingAddress: this.address, paymentMethod: this.paymentMethod, razorpay })
      .subscribe({
        next: (order) => {
          this.cart.clearLocal();
          this.router.navigate(['/order-success', order._id]);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Could not place the order. Please try again.';
          this.placing = false;
        },
      });
  }
}

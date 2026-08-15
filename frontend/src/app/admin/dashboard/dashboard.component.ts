import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { Order, Product } from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  loading = true;

  constructor(private productService: ProductService, private orderService: OrderService) {}

  ngOnInit() {
    Promise.all([
      firstValueFrom(this.productService.adminList()),
      firstValueFrom(this.orderService.allOrders()),
    ]).then(([products, orders]) => {
      this.products = products || [];
      this.orders = orders || [];
      this.loading = false;
    });
  }

  get lowStockCount() {
    return this.products.filter((p) => p.isActive && p.stock <= 5).length;
  }

  get revenue() {
    return this.orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }

  get pendingCount() {
    return this.orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  }
}

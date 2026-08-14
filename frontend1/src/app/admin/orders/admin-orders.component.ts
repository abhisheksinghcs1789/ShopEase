import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/models';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  statuses = STATUSES;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.orderService.allOrders().subscribe((orders) => {
      this.orders = orders;
      this.loading = false;
    });
  }

  updateStatus(order: Order, status: string) {
    this.orderService.updateStatus(order._id, status).subscribe((updated) => {
      order.status = updated.status;
      order.statusHistory = updated.statusHistory;
    });
  }

  customerLabel(order: Order): string {
    if (order.user && typeof order.user === 'object') return order.user.name;
    return 'Customer';
  }
}

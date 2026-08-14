import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/models';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  expandedId: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.myOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  toggle(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  stepIndex(order: Order): number {
    if (order.status === 'cancelled') return -1;
    return STEPS.indexOf(order.status);
  }

  steps = STEPS;
}

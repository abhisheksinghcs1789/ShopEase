import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/models';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss',
})
export class OrderSuccessComponent implements OnInit {
  order: Order | null = null;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getById(id).subscribe((order) => (this.order = order));
  }
}

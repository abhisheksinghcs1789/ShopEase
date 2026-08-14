import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  loading = true;
  notFound = false;
  added = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cart: CartService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  changeQty(delta: number) {
    if (!this.product) return;
    this.quantity = Math.min(Math.max(1, this.quantity + delta), this.product.stock);
  }

  addToCart() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.product) return;
    this.cart.add(this.product._id, this.quantity).subscribe(() => {
      this.added = true;
      setTimeout(() => (this.added = false), 2000);
    });
  }
}

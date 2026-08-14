import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  search = '';
  activeCategory = '';
  loading = true;
  page = 1;
  pages = 1;

  constructor(
    private productService: ProductService,
    private cart: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.categories().subscribe((cats) => (this.categories = cats));
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.productService
      .list({ search: this.search, category: this.activeCategory, page: this.page })
      .subscribe({
        next: (res) => {
          this.products = res.products;
          this.pages = res.pages;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onSearch() {
    this.page = 1;
    this.fetch();
  }

  selectCategory(cat: string) {
    this.activeCategory = this.activeCategory === cat ? '' : cat;
    this.page = 1;
    this.fetch();
  }

  changePage(delta: number) {
    this.page = Math.min(Math.max(1, this.page + delta), this.pages);
    this.fetch();
  }

  onAddToCart(product: Product) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cart.add(product._id, 1).subscribe();
  }
}

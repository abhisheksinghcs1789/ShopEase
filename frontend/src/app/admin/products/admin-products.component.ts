import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/models';

type ProductForm = Partial<Product>;

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  showForm = false;
  editingId: string | null = null;
  saving = false;
  error = '';

  form: ProductForm = this.emptyForm();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.productService.adminList().subscribe((products) => {
      this.products = products;
      this.loading = false;
    });
  }

  emptyForm(): ProductForm {
    return { name: '', description: '', price: 0, category: '', image: '', stock: 0 };
  }

  openCreate() {
    this.editingId = null;
    this.form = this.emptyForm();
    this.showForm = true;
  }

  openEdit(product: Product) {
    this.editingId = product._id;
    this.form = { ...product };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.error = '';
  }

  save() {
    if (!this.form.name || !this.form.category || this.form.price == null) {
      this.error = 'Name, category, and price are required.';
      return;
    }
    this.saving = true;
    const request$ = this.editingId
      ? this.productService.update(this.editingId, this.form)
      : this.productService.create(this.form);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.closeForm();
        this.fetch();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Could not save the product.';
        this.saving = false;
      },
    });
  }

  quickStockUpdate(product: Product, value: string) {
    const stock = Number(value);
    if (Number.isNaN(stock) || stock < 0) return;
    this.productService.updateStock(product._id, stock).subscribe((updated) => {
      product.stock = updated.stock;
    });
  }

  remove(product: Product) {
    if (!confirm(`Remove "${product.name}" from the catalog?`)) return;
    this.productService.remove(product._id).subscribe(() => this.fetch());
  }
}

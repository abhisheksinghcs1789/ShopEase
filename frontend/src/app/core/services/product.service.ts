import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments';
import { Product } from '../models/models';

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  list(params: { search?: string; category?: string; page?: number } = {}): Observable<ProductListResponse> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.page) query.set('page', String(params.page));
    return this.http.get<ProductListResponse>(`${this.base}?${query.toString()}`);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  categories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/categories`);
  }

  // ---- admin ----

  adminList(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/admin/all`);
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.base, product);
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, product);
  }

  updateStock(id: string, stock: number): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${id}/stock`, { stock });
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}

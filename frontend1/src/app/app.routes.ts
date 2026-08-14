import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'order-success/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-success/order-success.component').then((m) => m.OrderSuccessComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'admin/products',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/products/admin-products.component').then((m) => m.AdminProductsComponent),
  },
  {
    path: 'admin/orders',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
  },
  { path: '**', redirectTo: '' },
];

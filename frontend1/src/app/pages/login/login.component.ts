import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: '../register/auth.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private cart: CartService, private router: Router) {}

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.cart.load().subscribe();
        this.router.navigate(this.auth.isAdmin() ? ['/admin'] : ['/']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      },
    });
  }
}

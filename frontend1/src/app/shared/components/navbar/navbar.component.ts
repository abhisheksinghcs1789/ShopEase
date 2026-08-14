import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(public auth: AuthService, public cart: CartService, private router: Router) {
    if (this.auth.isLoggedIn()) {
      this.cart.load().subscribe();
    }
  }

  logout() {
    this.auth.logout();
    this.cart.clearLocal();
    this.router.navigate(['/']);
  }
}

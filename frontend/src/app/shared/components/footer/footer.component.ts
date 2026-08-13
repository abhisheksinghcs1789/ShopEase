import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <span class="eyebrow">ShopEase</span>
        <p>Built as a demo e-commerce project — cart, checkout, order tracking, and an admin dashboard.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: 64px;
      border-top: 1.5px solid var(--color-line);
      padding: 28px 0 40px;
    }
    .footer__inner p {
      margin: 6px 0 0;
      font-size: 0.85rem;
      color: var(--color-ink);
      opacity: 0.65;
    }
  `],
})
export class FooterComponent {}

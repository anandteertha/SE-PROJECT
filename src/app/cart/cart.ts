import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '@app/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  items: any[] = [];
  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart(parseInt(localStorage.getItem('userId') || '1')).subscribe({
      next: (data) => {
        this.items = [...data];
      },
      error: (err) => {
        console.error('Failed to load cart', err);
      },
      complete: () => {
        console.log(this.items);
      },
    });
  }

  clearCart() {
    if (confirm('Clear all items from cart?')) {
      this.items = [];
    }
  }
}

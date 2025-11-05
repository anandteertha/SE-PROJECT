import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent implements OnInit {
  items: any[] = [];
  totals: any = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.http.get<any>('http://127.0.0.1:4000/api/cart').subscribe({
      next: (data) => {
        this.items = data.items;
        this.totals = data.totals;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.loading = false;
      }
    });
  }

  clearCart() {
    if (confirm('Clear all items from cart?')) {
      this.items = [];
      this.totals = { currencyTotal: 0, nutrition: { calories: 0, carbs: 0, fat: 0, protein: 0 } };
    }
  }
}

import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuCartData } from '@app/models/menu-cart';
import { CartService } from '@app/services/cart.service';
import { MenuService } from '@app/services/menu.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  items: MenuCartData[] = [];
  destroyed: Subject<boolean> = new Subject<boolean>();
  user_id: string | null = localStorage.getItem('userId');
  constructor(
    private cartService: CartService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private menuItemService: MenuService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService
      .getCart(this.user_id || '')
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (data) => {
          this.items = [...data];
          console.log(this.items);
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load cart', err);
        },
      });
  }

  clearCart() {
    if (confirm('Clear all items from cart?')) {
      this.items = [];
    }
  }

  inc(item: MenuCartData) {
    item.Quantity = (item.Quantity || 0) + 1;
    this.menuItemService
      .postUserCartData(item)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (data) => {
          console.log('updated cart data!', data);
        },
      });
  }

  dec(item: MenuCartData) {
    const next = (item.Quantity || 0) - 1;
    console.log(next);
    if (next > 0) {
      alert(`${item.Name} removed from cart`);
      this.menuItemService
        .postUserCartData(item)
        .pipe(takeUntil(this.destroyed))
        .subscribe({
          next: (data) => {
            console.log('updated cart data!', data);
          },
        });
      return;
    } else if (next <= 0) {
      this.cartService
        .removeItem(item.MenuItemId, item.UserId)
        .pipe(takeUntil(this.destroyed))
        .subscribe({
          next: (data) => {
            console.log(data);
          },
        });
    }
    item.Quantity = next;
    this.items = this.items.filter((item) => item !== item && item.Quantity > 0);
  }

  menu(): void {
    this.router.navigate(['/menu']);
  }

  checkout() {
    if (!this.items?.length) return;
    alert('Proceeding to checkout...');
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }
}

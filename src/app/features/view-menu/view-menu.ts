import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../models/menu-item';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-menu.html',
  styleUrls: ['./view-menu.scss']
})
export class ViewMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  selectedTag = 'all';
  darkMode = false;
  cartCount$: Observable<number>;

  constructor(private menuService: MenuService, private cart: CartService) {
    this.cartCount$ = this.cart.count$;
  }

  ngOnInit() {
    this.menuService.getMenuItems().subscribe((data) => {
      this.menuItems = data.map((item) => ({ ...item, count: 0 }));
      this.filteredItems = [...this.menuItems];
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    // Also toggle a global body class so the entire page (outside this
    // component) can switch to dark mode. Guard against server-side
    // rendering where `document` may be undefined.
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', this.darkMode);
    }
  }

  filterByTag(tag: string) {
    this.selectedTag = tag;
    this.filteredItems =
      tag === 'all'
        ? this.menuItems
        : this.menuItems.filter((item) => item.tags?.includes(tag));
  }

  addToCart(item: MenuItem) {
    item.count = (item.count || 0) + 1;
    this.cart.add(1);
  }

  removeFromCart(item: MenuItem) {
    if (item.count && item.count > 0) {
      item.count--;
      this.cart.add(-1);
    }
  }

  getImageSrc(item: MenuItem): string {
    if (!item.imageUrl) return 'assets/images/placeholder.png';
    return item.imageUrl.startsWith('/') ? item.imageUrl : '/' + item.imageUrl;
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.png';
  }
}

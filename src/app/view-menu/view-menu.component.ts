import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../models/menu-item';
import { MenuService } from '../services/menu.service';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';
import { PacmanLoaderComponent } from '../pacman-loader/pacman-loader.component';
import { RevolvingButtonComponent } from '../revolving-button/revolving-button.component';
import { SearchBar } from '../search-bar/search-bar';


@Component({
  selector: 'app-view-menu',
  standalone: true,
  imports: [CommonModule, PacmanLoaderComponent, RevolvingButtonComponent, SearchBar],
  templateUrl: './view-menu.component.html',
  styleUrls: ['./view-menu.component.scss']
})
export class ViewMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  selectedTag = 'all';
  darkMode = false;
  cartCount$: Observable<number>;
  searchQuery: string = '';
  cartBounce: boolean = false;

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
    this.applyFilters();
  }

  onSearchChange(query: string) {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  private applyFilters() {
    let items = this.menuItems;

    // Apply tag filter
    if (this.selectedTag !== 'all') {
      items = items.filter((item) => item.tags?.includes(this.selectedTag));
    }

    // Apply search filter
    if (this.searchQuery) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(this.searchQuery) ||
        (item.description && item.description.toLowerCase().includes(this.searchQuery)) ||
        item.tags?.some(tag => tag.toLowerCase().includes(this.searchQuery))
      );
    }

    this.filteredItems = items;
  }

  addToCart(item: MenuItem) {
    item.count = (item.count || 0) + 1;
    this.cart.add(1);
    this.triggerCartBounce();
  }

  removeFromCart(item: MenuItem) {
    if (item.count && item.count > 0) {
      item.count--;
      this.cart.add(-1);
      this.triggerCartBounce();
    }
  }

  onCartClick() {
    // Add your cart navigation or modal logic here
    console.log('Cart clicked');
  }

  private triggerCartBounce() {
    this.cartBounce = true;
    setTimeout(() => {
      this.cartBounce = false;
    }, 600);
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

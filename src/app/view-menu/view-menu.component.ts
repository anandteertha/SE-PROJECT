import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../models/menu-item';
import { MenuService } from '../services/menu.service';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';
import { PacmanLoaderComponent } from '../pacman-loader/pacman-loader.component';
import { RevolvingButtonComponent } from '../revolving-button/revolving-button.component';
import { SearchBar } from '../search-bar/search-bar';
import { FiltersPanelComponent, FilterCriteria } from '../filters-panel/filters-panel.component';


@Component({
  selector: 'app-view-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, PacmanLoaderComponent, RevolvingButtonComponent, SearchBar, FiltersPanelComponent],
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
  // taste filters (0-10)
  selectedSpiciness: number = 0;
  selectedSweetness: number = 0;
  // salt levels: 'any' | 'less' | 'medium' | 'high'
  selectedSalt: FilterCriteria['salt'] = 'any';
  // category filter
  selectedCategory: string = 'all';
  // filter lists
  readonly categories = ['Breakfast','Curry','Starters','Breads','Rice','Soups','Ice-cream','Snacks','Tea','Coffee','Milkshake'];
  readonly tags = ['Vegan','Vegetarian','Swami Narayan','Jain','Non Vegetarian','Gluten Free','Kosher','Halal'];

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

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onFiltersChanged(f: FilterCriteria) {
    this.selectedCategory = f.category;
    this.selectedTag = f.tag;
    this.selectedSpiciness = f.spiciness;
    this.selectedSweetness = f.sweetness;
    this.selectedSalt = f.salt;
    this.applyFilters();
  }

  onSearchChange(query: string) {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  // made public so template can call it on range input events
  applyFilters() {
    let items = this.menuItems;

    // Apply tag filter (case-insensitive exact match)
    if (this.selectedTag !== 'all') {
      const sel = this.selectedTag?.toLowerCase();
      items = items.filter((item) => item.tags?.some(t => t.toLowerCase() === sel));
    }

    // Apply taste filters: treat missing values as 0
    items = items.filter(item => (item as any).spiciness == null || (item as any).spiciness >= this.selectedSpiciness ? true : false);
    items = items.filter(item => (item as any).sweetness == null || (item as any).sweetness >= this.selectedSweetness ? true : false);

    // Apply salt filter (exact match if selectedSalt != 'any')
    if (this.selectedSalt && this.selectedSalt !== 'any') {
      const s = this.selectedSalt.toLowerCase();
      items = items.filter(item => ((item as any).saltLevel || '').toLowerCase() === s);
    }

    // Apply category filter (case-insensitive exact, 'all' means no filter)
    if (this.selectedCategory !== 'all') {
      const c = this.selectedCategory.toLowerCase();
      items = items.filter(item => ((item as any).category || '').toLowerCase() === c);
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

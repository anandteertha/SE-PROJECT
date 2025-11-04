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
import { UserProfileComponent } from '../user-profile/user-profile.component';


@Component({
  selector: 'app-view-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, PacmanLoaderComponent, RevolvingButtonComponent, SearchBar, FiltersPanelComponent, UserProfileComponent],
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
  selectedSpiciness: number = 0;
  selectedSweetness: number = 0;
  selectedSalt: FilterCriteria['salt'] = 'any';
  selectedCategory: string = 'all';
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

  applyFilters() {
    let items = this.menuItems;

    if (this.selectedTag !== 'all') {
      const sel = this.selectedTag?.toLowerCase();
      items = items.filter((item) => item.tags?.some(t => t.toLowerCase() === sel));
    }

    items = items.filter(item => (item as any).spiciness == null || (item as any).spiciness >= this.selectedSpiciness ? true : false);
    items = items.filter(item => (item as any).sweetness == null || (item as any).sweetness >= this.selectedSweetness ? true : false);

    if (this.selectedSalt && this.selectedSalt !== 'any') {
      const s = this.selectedSalt.toLowerCase();
      items = items.filter(item => ((item as any).saltLevel || '').toLowerCase() === s);
    }

    if (this.selectedCategory !== 'all') {
      const c = this.selectedCategory.toLowerCase();
      items = items.filter(item => ((item as any).category || '').toLowerCase() === c);
    }

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
    console.log('Cart clicked');
  }

  onProfileAction(action: string) {
    console.log('Profile action:', action);
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

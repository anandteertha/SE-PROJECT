import { map, Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterCriteria, FiltersPanelComponent } from '@app/filters-panel/filters-panel.component';
import { CartItem } from '@app/models/cart-item';
import { MenuData } from '@app/models/menu-data';
import { MenuSettings } from '@app/models/menu-settings';
import { PacmanLoaderComponent } from '@app/pacman-loader/pacman-loader.component';
import { RevolvingButtonComponent } from '@app/revolving-button/revolving-button.component';
import { SearchBar } from '@app/search-bar/search-bar';
import { CartService } from '@app/services/cart.service';
import { MenuService } from '@app/services/menu.service';
import { UserProfileComponent } from '@app/user-profile/user-profile.component';
import { MenuItem } from '@models/menu-item';

@Component({
  selector: 'app-view-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PacmanLoaderComponent,
    RevolvingButtonComponent,
    SearchBar,
    FiltersPanelComponent,
    UserProfileComponent,
  ],
  templateUrl: './view-menu.component.html',
  styleUrls: ['./view-menu.component.scss'],
})
export class ViewMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  selectedDietaryPreference = 'all';
  darkMode = false;
  cartCount$: Observable<number>;
  searchQuery: string = '';
  cartBounce: boolean = false;
  selectedSpiciness: number = 0;
  selectedSweetness: number = 0;
  selectedSalt: FilterCriteria['salt'] = 'any';
  selectedCategory: string = 'all';
  dietaryPreferences: string[] = [];
  menuCategories: string[] = [];
  menuSettings: MenuSettings[] = [];
  cartItems: Map<number, CartItem> = new Map<number, CartItem>();
  userId: number = 1;

  constructor(private menuService: MenuService, private cart: CartService) {
    this.cartCount$ = this.cart.count$;
  }

  ngOnInit() {
    this.menuService
      .getMenuData(this.userId) // replace with user_id
      .pipe(
        map((menuData: MenuData) => {
          this.dietaryPreferences = menuData.dietary_preferences.map(
            (dietaryPreference) => dietaryPreference.Name
          );
          this.menuCategories = menuData.menu_categories.map((menuCategory) => menuCategory.Name);
          this.menuItems = menuData.menu_items;
          this.menuSettings = menuData.user_menu_settings;
          menuData.cart_items.forEach((cartItem) => {
            this.cartItems.set(cartItem.MenuItemId, cartItem);
            this.cart.add(cartItem.Quantity);
          });
        })
      )
      .subscribe({
        complete: () => {
          this.filteredItems = [...this.menuItems];
        },
      });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', this.darkMode);
    }
  }

  filterByTag(tag: string) {
    this.selectedDietaryPreference = tag;
    this.applyFilters();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onFiltersChanged(filters: FilterCriteria) {
    this.selectedCategory = filters.category;
    this.selectedDietaryPreference = filters.dietaryPreference;
    this.selectedSpiciness = filters.spiciness;
    this.selectedSweetness = filters.sweetness;
    this.selectedSalt = filters.salt;
    this.applyFilters();
  }

  onSearchChange(query: string) {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    let items = this.menuItems;

    if (this.selectedDietaryPreference && this.selectedDietaryPreference !== 'all') {
      items = items.filter((item) => item.DietType === this.selectedDietaryPreference);
    }

    if (this.selectedCategory !== 'all') {
      items = items.filter((item) => item.Category === this.selectedCategory);
    }

    if (this.searchQuery) {
      items = items.filter(
        (item) =>
          item.Name.toLowerCase().includes(this.searchQuery) ||
          (item.Description && item.Description.toLowerCase().includes(this.searchQuery)) ||
          (item.DietType && item.DietType.toLowerCase().includes(this.searchQuery))
      );
    }

    this.filteredItems = items;
  }

  addToCart(item: MenuItem) {
    const count = this.cartItems?.get(item.Id)?.Quantity || 0;
    this.cartItems.set(item.Id, {
      MenuItemId: item.Id,
      Quantity: count + 1,
      UserId: this.userId,
    });
    this.cart.add(1);
    this.triggerCartBounce();
    this.menuService.postUserCartData(this.cartItems.get(item.Id) as CartItem).subscribe({
      complete: () => {},
    });
  }

  removeFromCart(item: MenuItem) {
    const cartItem: CartItem = this.cartItems.get(item.Id) as CartItem;
    const count: number = cartItem?.Quantity || 0;
    if (count > 0) {
      this.cartItems.set(item.Id, {
        ...cartItem,
        Quantity: cartItem.Quantity - 1,
      });
      this.cart.add(-1);
      this.triggerCartBounce();
      this.menuService.postUserCartData(this.cartItems.get(item.Id) as CartItem).subscribe({
        complete: () => {},
      });
    }
  }

  onCartClick() {}

  onProfileAction(action: string) {}

  private triggerCartBounce() {
    this.cartBounce = true;
    setTimeout(() => {
      this.cartBounce = false;
    }, 600);
  }

  getImageSrc(item: MenuItem): string {
    const baseUrl = 'https://ik.imagekit.io/SEProjectG4/menu-items/menu-items-images/';
    return `${baseUrl}${item.ImageUrl}`;
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
  }
}

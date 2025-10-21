import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { menuItem } from '../../models/menu-item';
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
  menuItems: menuItem[] = [];
  filteredItems: menuItem[] = [];
  selectedTag = 'all';
  cartCount$: Observable<number>;

  constructor(private menuService: MenuService, private cart: CartService) {
    this.cartCount$ = this.cart.count$;
  }

  ngOnInit() {
    this.menuService.getMenuItems().subscribe(data => {
      this.menuItems = data;
      this.filteredItems = data;
    });
  }

  filterByTag(tag: string) {
    this.selectedTag = tag;
    this.filteredItems =
      tag === 'all'
        ? this.menuItems
        : this.menuItems.filter(item => item.tags.includes(tag));
  }

  // Helper to safely read optional nutrition fields without causing template type-check errors
  getNutrition(item: menuItem): string {
    const p = (item as any).protein ?? '—';
    const c = (item as any).calories ?? '—';
    return `Protein: ${p}g • Calories: ${c}`;
  }

  addToCart(item: menuItem) {
    this.cart.add(1);
  }

  removeFromCart(item: menuItem) {
    this.cart.add(-1);
  }
}

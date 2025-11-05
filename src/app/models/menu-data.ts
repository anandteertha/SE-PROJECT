import { CartItem } from '@models/cart-item';
import { MenuItem } from '@models/menu-item';
import { MenuSettings } from '@models/menu-settings';
import { NameModel } from '@models/name-model';

export interface MenuData {
  cart_items: CartItem[];
  dietary_preferences: NameModel[];
  menu_categories: NameModel[];
  menu_items: MenuItem[];
  user_menu_settings: MenuSettings[];
}

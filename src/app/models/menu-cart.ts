import { CartItem } from '@app/models/cart-item';
import { MenuItem } from '@app/models/menu-item';

export interface MenuCartData extends CartItem, MenuItem {}

import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'cart', component: CartComponent }
];

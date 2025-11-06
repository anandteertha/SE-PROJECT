import { Routes } from '@angular/router';
import { Login } from '@app/auth/login/login';
import { Register } from '@app/auth/register/register';
import { CartComponent } from '@app/cart/cart';
import { ViewMenuComponent } from '@app/view-menu/view-menu';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: ViewMenuComponent },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'cart', component: CartComponent },
];

import { Routes } from '@angular/router';

// 1. Import your new components
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './home/home';

// 2. Add your new routes to the array
export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {path: 'home', component: Home},
  {path: '', redirectTo: '/home', pathMatch: 'full' }
];
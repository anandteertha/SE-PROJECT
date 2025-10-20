import { Routes } from '@angular/router';
import { ViewMenuComponent } from './features/view-menu/view-menu';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: ViewMenuComponent }
];

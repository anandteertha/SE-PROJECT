import { Routes } from '@angular/router';
import { ViewMenuComponent } from './view-menu/view-menu.component';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: ViewMenuComponent }
];

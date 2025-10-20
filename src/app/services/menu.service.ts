import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { menuItem } from '../models/menu-item';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private dataUrl = 'menu.json';

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<menuItem[]> {
    return this.http.get<menuItem[]>(this.dataUrl);
  }
}

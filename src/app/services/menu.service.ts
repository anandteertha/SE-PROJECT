import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private dataUrl = 'menu.json';

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.dataUrl);
  }
}

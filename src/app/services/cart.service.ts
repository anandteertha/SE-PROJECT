import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _count$ = new BehaviorSubject<number>(0);
  readonly count$ = this._count$.asObservable();
  baseUrl = `${environment.apiBase}/cart`;

  constructor(private http: HttpClient) {}

  getCart(user_id: string): Observable<any> {
    const params = new HttpParams().set('user_id', user_id);
    return this.http.get(this.baseUrl, { params });
  }

  removeItem(menuItemId: number, userId: number): Observable<any> {
    const params = new HttpParams().appendAll({
      menu_item_id: menuItemId,
      user_id: userId,
    });
    return this.http.delete(this.baseUrl, { params });
  }

  removeAllItems(userId: string): Observable<any> {
    const params = new HttpParams().append('user_id', userId);
    return this.http.delete(`${this.baseUrl}/all`, { params });
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/items/${productId}`, { quantity });
  }
}

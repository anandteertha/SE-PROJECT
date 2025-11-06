import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _count$ = new BehaviorSubject<number>(0);
  readonly count$ = this._count$.asObservable();
  baseUrl = '/api/cart';

  constructor(private http: HttpClient) {}

  add(quantity = 1) {
    this._count$.next(this._count$.value + quantity);
  }

  clear() {
    this._count$.next(0);
  }

  getCart(user_id: number): Observable<any> {
    const params = new HttpParams().set('user_id', user_id);
    return this.http.get(this.baseUrl, { params });
  }

  removeItem(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${productId}`);
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/items/${productId}`, { quantity });
  }
}

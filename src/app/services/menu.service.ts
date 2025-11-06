import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartItem } from '@app/models/cart-item';
import { MenuData } from '@app/models/menu-data';
import { UserDetails } from '@app/models/user-details';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private dataUrl = '/api';

  constructor(private http: HttpClient) {}

  getMenuData(user_id: number): Observable<MenuData> {
    const params = new HttpParams().set('user_id', user_id);
    return this.http.get<MenuData>(`${this.dataUrl}/menu-items`, {
      params: params,
    });
  }

  postUserCartData(cartData: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.dataUrl}/cart`, cartData);
  }

  patchUserDetails(userDetailsData: UserDetails): Observable<{}> {
    return this.http.patch<{}>(`${this.dataUrl}/user/preferences`, userDetailsData);
  }

  getUserDetails(user_id: number): Observable<UserDetails> {
    const params = new HttpParams().set('user_id', user_id);
    return this.http.get<UserDetails>(`${this.dataUrl}/user/details`, {
      params: params,
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface CartResponse {
  items: CartItem[];
  totals: {
    currencyTotal: number;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = `${environment.apiBaseUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.baseUrl);
  }

  removeItem(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${productId}`);
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/items/${productId}`, { quantity });
  }

  checkout(): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/checkout`, {});
  }
}

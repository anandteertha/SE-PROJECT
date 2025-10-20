import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _count$ = new BehaviorSubject<number>(0);

  readonly count$ = this._count$.asObservable();

  add(quantity = 1) {
    this._count$.next(this._count$.value + quantity);
  }

  clear() {
    this._count$.next(0);
  }
}

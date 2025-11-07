import { environment } from 'environments/environment';
import { take } from 'rxjs/operators';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartService } from '@app/services/cart.service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiBase}/cart`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose initial count$ as 0', (done) => {
    service.count$.pipe(take(1)).subscribe((v) => {
      expect(v).toBe(0);
      done();
    });
  });

  it('getCart should GET with user_id as query param', () => {
    const userId = 'u123';
    const mockResponse = { items: [{ id: 1 }], total: 1 };

    service.getCart(userId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.method === 'GET' && r.url === baseUrl);
    expect(req.request.params.get('user_id')).toBe(userId);
    req.flush(mockResponse);
  });

  it('removeItem should DELETE with menu_item_id and user_id as query params', () => {
    const menuItemId = 7;
    const userId = 42;
    const mockResponse = { success: true };

    service.removeItem(menuItemId, userId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.method === 'DELETE' && r.url === baseUrl);
    expect(req.request.params.get('menu_item_id')).toBe(String(menuItemId));
    expect(req.request.params.get('user_id')).toBe(String(userId));
    req.flush(mockResponse);
  });

  it('removeAllItems should DELETE /all with user_id as query param', () => {
    const userId = 'abc';
    const mockResponse = { deleted: true };

    service.removeAllItems(userId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.method === 'DELETE' && r.url === `${baseUrl}/all`);
    expect(req.request.params.get('user_id')).toBe(userId);
    req.flush(mockResponse);
  });

  it('updateQuantity should PATCH /items/:productId with { quantity } body', () => {
    const productId = 55;
    const quantity = 3;
    const mockResponse = { updated: true };

    service.updateQuantity(productId, quantity).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (r) => r.method === 'PATCH' && r.url === `${baseUrl}/items/${productId}`
    );

    expect(req.request.body).toEqual({ quantity });
    req.flush(mockResponse);
  });
});

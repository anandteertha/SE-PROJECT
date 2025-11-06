import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartItem } from '@app/models/cart-item';
import { MenuData } from '@app/models/menu-data';
import { UserDetails } from '@app/models/user-details';
import { MenuService } from '@app/services/menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuService, provideZonelessChangeDetection()],
    });
    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getMenuData issues GET /api/menu-items with user_id param and returns MenuData', () => {
    const mock: MenuData = {
      dietary_preferences: [{ Name: 'VEG' }, { Name: 'NON_VEG' }],
      menu_categories: [{ Name: 'Curry' }, { Name: 'Starter' }],
      menu_items: [
        {
          Id: 1,
          Name: 'Paneer',
          Description: 'spicy',
          DietType: 'VEG',
          Category: 'Curry',
          ImageUrl: 'p.png',
          Cost: 15,
          CalorieCount: 475,
          ProteinCount: 18,
        },
        {
          Id: 2,
          Name: 'Chicken',
          Description: 'hot',
          DietType: 'NON_VEG',
          Category: 'Starter',
          ImageUrl: 'c.png',
          Cost: 14.25,
          CalorieCount: 520,
          ProteinCount: 30,
        },
      ],
      user_menu_settings: [] as any,
      cart_items: [{ MenuItemId: 1, Quantity: 2, UserId: 1 }],
    };

    let received: MenuData | undefined;
    service.getMenuData(1).subscribe((r) => (received = r));

    const req = httpMock.expectOne((r) => r.method === 'GET' && r.url === '/api/menu-items');
    expect(req.request.params.get('user_id')).toBe('1');
    req.flush(mock);

    expect(received).toEqual(mock);
  });

  it('postUserCartData issues POST /api/cart with body and returns CartItem', () => {
    const body: CartItem = { UserId: 1, MenuItemId: 2, Quantity: 3, ExtraNote: 'less salt' };

    let received: CartItem | undefined;
    service.postUserCartData(body).subscribe((r) => (received = r));

    const req = httpMock.expectOne('/api/cart');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(body);

    expect(received).toEqual(body);
  });

  it('patchUserDetails issues PATCH /api/user/preferences with body and returns {}', () => {
    const details: UserDetails = {
      Id: 1,
      Name: 'Test User',
      Email: 'test@example.com',
      Password: 'secret',
      DietaryPreference: 'VEG',
      Salt: 'Medium' as any,
      Spiciness: 50,
      Sweetness: 30,
    };

    let received: {} | undefined;
    service.patchUserDetails(details).subscribe((r) => (received = r));

    const req = httpMock.expectOne('/api/user/preferences');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(details);
    req.flush({});

    expect(received).toEqual({});
  });

  it('getUserDetails issues GET /api/user/details with user_id param and returns UserDetails', () => {
    const details: UserDetails = {
      Id: 7,
      Name: 'Alice',
      Email: 'alice@example.com',
      Password: 'pw',
      DietaryPreference: 'VEG',
      Salt: 'Low' as any,
      Spiciness: 20,
      Sweetness: 60,
    };

    let received: UserDetails | undefined;
    service.getUserDetails(7).subscribe((r) => (received = r));

    const req = httpMock.expectOne((r) => r.method === 'GET' && r.url === '/api/user/details');
    expect(req.request.params.get('user_id')).toBe('7');
    req.flush(details);

    expect(received).toEqual(details);
  });
});

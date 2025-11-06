import { BehaviorSubject, of } from 'rxjs';

import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartItem } from '@app/models/cart-item';
import { MenuData } from '@app/models/menu-data';
import { MenuItem } from '@app/models/menu-item';
import { UserDetails } from '@app/models/user-details';
import { CartService } from '@app/services/cart.service';
import { MenuService } from '@app/services/menu.service';
import { ViewMenuComponent } from '@app/view-menu/view-menu';

describe('ViewMenuComponent (zoneless)', () => {
  let fixture: any;
  let viewMenuComponent: ViewMenuComponent;
  let menuSpy: jasmine.SpyObj<MenuService>;
  let cartSpy: jasmine.SpyObj<CartService>;
  const cartCount$ = new BehaviorSubject<number>(0);

  const MENU_ITEMS: MenuItem[] = [
    {
      Id: 1,
      Name: 'Paneer',
      Description: 'spicy paneer',
      DietType: 'VEG',
      Category: 'Curry',
      ImageUrl: 'paneer.png',
      Cost: 15,
      CalorieCount: 475,
      ProteinCount: 18,
    },
    {
      Id: 2,
      Name: 'Chicken',
      Description: 'hot and tasty',
      DietType: 'NON_VEG',
      Category: 'Starter',
      ImageUrl: 'chicken.png',
      Cost: 14.25,
      CalorieCount: 520,
      ProteinCount: 30,
    },
  ];
  const CART_ITEMS: CartItem[] = [{ MenuItemId: 1, Quantity: 2, UserId: 1 }];
  const MENU_DATA: MenuData = {
    dietary_preferences: [{ Name: 'VEG' }, { Name: 'NON_VEG' }],
    menu_categories: [{ Name: 'Curry' }, { Name: 'Starter' }],
    menu_items: MENU_ITEMS,
    user_menu_settings: [],
    cart_items: CART_ITEMS,
  };
  const USER_DETAILS: UserDetails = {
    Id: 1,
    Name: 'Test User',
    Email: 'test@example.com',
    Password: 'secret',
    DietaryPreference: 'VEG',
    Salt: 'Medium',
    Spiciness: 30,
    Sweetness: 40,
  };

  beforeEach(async () => {
    jasmine.clock().install();

    menuSpy = jasmine.createSpyObj<MenuService>('MenuService', [
      'getMenuData',
      'getUserDetails',
      'patchUserDetails',
      'postUserCartData',
    ]);
    cartSpy = jasmine.createSpyObj<CartService>('CartService', ['add'], {
      count$: cartCount$.asObservable(),
    });

    menuSpy.getMenuData.and.returnValue(of(MENU_DATA));
    menuSpy.getUserDetails.and.returnValue(of(USER_DETAILS));
    menuSpy.patchUserDetails.and.returnValue(of({}));
    menuSpy.postUserCartData.and.returnValue(of(CART_ITEMS[0]));

    localStorage.clear();
    localStorage.setItem('darkMode', 'yes');

    await TestBed.configureTestingModule({
      imports: [ViewMenuComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MenuService, useValue: menuSpy },
        { provide: CartService, useValue: cartSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ViewMenuComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ViewMenuComponent);
    viewMenuComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('loads data and applies dark mode', () => {
    expect(menuSpy.getMenuData).toHaveBeenCalled();
    expect(menuSpy.getUserDetails).toHaveBeenCalledWith(1);
    expect(viewMenuComponent.menuItems.length).toBe(2);
    expect(viewMenuComponent.filteredItems.length).toBe(2);
    expect(viewMenuComponent.dietaryPreferences).toEqual(['VEG', 'NON_VEG']);
    expect(viewMenuComponent.menuCategories).toEqual(['Curry', 'Starter']);
    expect(cartSpy.add).toHaveBeenCalledWith(2);
    expect(document.body.classList.contains('dark-mode')).toBeTrue();
  });

  it('toggleDarkMode flips and persists', () => {
    const before = viewMenuComponent.darkMode;
    viewMenuComponent.toggleDarkMode();
    expect(viewMenuComponent.darkMode).toBe(!before);
    expect(localStorage.getItem('darkMode')).toBe(viewMenuComponent.darkMode ? 'yes' : 'no');
    expect(document.body.classList.contains('dark-mode')).toBe(viewMenuComponent.darkMode);
  });

  it('filterByTag + filterByCategory narrow items and patch via applyFilters', () => {
    const c = menuSpy.patchUserDetails.calls.count();
    viewMenuComponent.filterByTag('VEG');
    viewMenuComponent.filterByCategory('Curry');
    expect(viewMenuComponent.selectedDietaryPreference).toBe('VEG');
    expect(viewMenuComponent.selectedCategory).toBe('Curry');
    expect(
      viewMenuComponent.filteredItems.every((i) => i.DietType === 'VEG' && i.Category === 'Curry')
    ).toBeTrue();
    expect(menuSpy.patchUserDetails.calls.count()).toBeGreaterThan(c);
  });

  it('onFiltersChanged updates selections and patches', () => {
    const c = menuSpy.patchUserDetails.calls.count();
    viewMenuComponent.onFiltersChanged({
      category: 'Starter',
      dietaryPreference: 'NON_VEG',
      spiciness: 90,
      sweetness: 10,
      salt: 'High',
    } as any);
    expect(viewMenuComponent.selectedCategory).toBe('Starter');
    expect(viewMenuComponent.selectedDietaryPreference).toBe('NON_VEG');
    expect(viewMenuComponent.selectedSpiciness).toBe(90);
    expect(viewMenuComponent.selectedSweetness).toBe(10);
    expect(viewMenuComponent.selectedSalt).toBe('High' as any);
    expect(menuSpy.patchUserDetails.calls.count()).toBeGreaterThan(c);
  });

  it('updateUserDetails sends current preference payload', () => {
    viewMenuComponent.selectedDietaryPreference = 'VEG';
    viewMenuComponent.selectedSalt = 'Low' as any;
    viewMenuComponent.selectedSpiciness = 55;
    viewMenuComponent.selectedSweetness = 25;
    const before = menuSpy.patchUserDetails.calls.count();
    viewMenuComponent.updateUserDetails();
    expect(menuSpy.patchUserDetails.calls.count()).toBe(before + 1);
    const sent = menuSpy.patchUserDetails.calls.mostRecent().args[0];
    expect(sent.DietaryPreference).toBe('VEG');
    expect(sent.Salt).toBe('Low' as any);
    expect(sent.Spiciness).toBe(55);
    expect(sent.Sweetness).toBe(25);
  });

  it('addToCart increments, posts, and clears bounce with timer', () => {
    const item = viewMenuComponent.menuItems[0];
    expect((viewMenuComponent as any).cartItems.get(item.Id)?.Quantity).toBe(2);
    viewMenuComponent.addToCart(item);
    expect((viewMenuComponent as any).cartItems.get(item.Id)?.Quantity).toBe(3);
    expect(cartSpy.add).toHaveBeenCalled();
    expect(menuSpy.postUserCartData).toHaveBeenCalled();
    expect(viewMenuComponent.cartBounce).toBeTrue();
    jasmine.clock().tick(601);
    expect(viewMenuComponent.cartBounce).toBeFalse();
  });

  it('removeFromCart decrements to zero, posts while >0, then stops', () => {
    const item = viewMenuComponent.menuItems[0];
    menuSpy.postUserCartData.calls.reset();
    viewMenuComponent.removeFromCart(item);
    expect((viewMenuComponent as any).cartItems.get(item.Id)?.Quantity).toBe(1);
    expect(menuSpy.postUserCartData).toHaveBeenCalledTimes(1);
    viewMenuComponent.removeFromCart(item);
    expect((viewMenuComponent as any).cartItems.get(item.Id)?.Quantity).toBe(0);
    expect(menuSpy.postUserCartData).toHaveBeenCalledTimes(2);
    viewMenuComponent.removeFromCart(item);
    expect(menuSpy.postUserCartData).toHaveBeenCalledTimes(2);
  });

  it('getImageSrc builds CDN URL', () => {
    const url = viewMenuComponent.getImageSrc({
      ImageUrl: 'x.png',
      Id: 9,
      Name: 'x',
      DietType: 'VEG',
      Category: 'Curry',
    } as any);
    expect(url).toBe('https://ik.imagekit.io/SEProjectG4/menu-items/menu-items-images/x.png');
  });

  it('onImgError accepts event target', () => {
    const img = document.createElement('img');
    const e = new Event('error');
    Object.defineProperty(e, 'target', { value: img });
    viewMenuComponent.onImgError(e);
    expect((e as any).target).toBe(img);
  });

  it('onSearchChange should set the query and call applyFilter', () => {
    spyOn(viewMenuComponent, 'applyFilters');
    viewMenuComponent.onSearchChange('SEARCH Query');
    expect(viewMenuComponent.searchQuery).toBe('search query');
    expect(viewMenuComponent.applyFilters).toHaveBeenCalled();
  });

  it('onSearchChange should filter the menu items by name', () => {
    viewMenuComponent.selectedDietaryPreference = 'all';
    viewMenuComponent.selectedCategory = 'all';
    viewMenuComponent.onSearchChange('Paneer');
    expect(viewMenuComponent.filteredItems.length).toBe(1);
  });

  it('onSearchChange should filter the menu items by description', () => {
    viewMenuComponent.selectedDietaryPreference = 'all';
    viewMenuComponent.selectedCategory = 'all';
    viewMenuComponent.onSearchChange('Paneer');
    expect(viewMenuComponent.filteredItems.length).toBe(1);
  });

  it('covers no-op handlers and destroy', () => {
    const spy = spyOn(viewMenuComponent.destroyed, 'next').and.callThrough();
    viewMenuComponent.onCartClick();
    viewMenuComponent.onProfileAction('profile');
    viewMenuComponent.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith(true);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ViewMenuComponent } from './view-menu.component';
import { MenuService } from '../services/menu.service';
import { CartService } from '../services/cart.service';

describe('ViewMenuComponent', () => {
  let component: ViewMenuComponent;
  let fixture: ComponentFixture<ViewMenuComponent>;

  beforeEach(async () => {
    // Mock services to isolate the component during testing
    const mockMenuService = {
      getMenuItems: () => of([]), // Return an observable with empty data
    };
    const mockCartService = {
      count$: of(0), // Return an observable for the cart count
      add: () => {},
    };

    await TestBed.configureTestingModule({
      // For standalone components, import them directly.
      // The `declarations` array is not used for standalone components.
      imports: [ViewMenuComponent],
      providers: [
        { provide: MenuService, useValue: mockMenuService },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

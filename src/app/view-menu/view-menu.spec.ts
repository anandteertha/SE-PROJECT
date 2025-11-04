import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ViewMenuComponent } from './view-menu.component';
import { MenuService } from '../services/menu.service';
import { CartService } from '../services/cart.service';

describe('ViewMenuComponent', () => {
  let component: ViewMenuComponent;
  let fixture: ComponentFixture<ViewMenuComponent>;

  beforeEach(async () => {
    const mockMenuService = {
      getMenuItems: () => of([]), 
    };
    const mockCartService = {
      count$: of(0), 
      add: () => {},
    };

    await TestBed.configureTestingModule({
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

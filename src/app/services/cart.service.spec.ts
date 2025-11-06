import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartService } from '@app/services/cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService, provideZonelessChangeDetection()],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CartService);
  });

  it('exposes a read-only count$ and starts at 0', () => {
    let latest = -1;
    const sub = service.count$.subscribe((v) => (latest = v));
    expect(latest).toBe(0);
    expect((service.count$ as any).next).toBeUndefined();
    sub.unsubscribe();
  });

  it('add() increments by default 1 and by provided quantity (including negatives)', () => {
    let latest = 0;
    const sub = service.count$.subscribe((v) => (latest = v));

    service.add(); // +1
    expect(latest).toBe(1);

    service.add(2); // +2 -> 3
    expect(latest).toBe(3);

    service.add(-1); // -1 -> 2
    expect(latest).toBe(2);

    sub.unsubscribe();
  });

  it('clear() resets the count to 0', () => {
    let latest = 0;
    const sub = service.count$.subscribe((v) => (latest = v));

    service.add(5);
    expect(latest).toBe(5);

    service.clear();
    expect(latest).toBe(0);

    sub.unsubscribe();
  });

  it('new subscribers receive the latest value immediately (BehaviorSubject behavior)', () => {
    service.add(4);
    let first = -1;
    service.count$.subscribe((v) => (first = v)).unsubscribe();
    expect(first).toBe(4);
  });
});

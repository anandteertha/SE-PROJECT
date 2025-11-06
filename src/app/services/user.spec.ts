import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { User } from '@app/services/user';

describe('User', () => {
  let service: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(User);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

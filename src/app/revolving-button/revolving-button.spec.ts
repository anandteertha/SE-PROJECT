import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RevolvingButtonComponent } from '@app/revolving-button/revolving-button';

describe('RevolvingButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevolvingButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RevolvingButtonComponent);
    const revolvingButtonComponent = fixture.componentInstance;
    expect(revolvingButtonComponent).toBeTruthy();
  });

  it('onClick should emit', () => {
    const fixture = TestBed.createComponent(RevolvingButtonComponent);
    const revolvingButtonComponent = fixture.componentInstance;
    spyOn(revolvingButtonComponent.buttonClick, 'emit');
    revolvingButtonComponent.onClick();
    expect(revolvingButtonComponent.buttonClick.emit).toHaveBeenCalled();
  });
});

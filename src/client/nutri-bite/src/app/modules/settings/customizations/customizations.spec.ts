import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customizations } from './customizations';

describe('Customizations', () => {
  let component: Customizations;
  let fixture: ComponentFixture<Customizations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customizations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Customizations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

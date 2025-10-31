import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fieldset } from './fieldset';

describe('Fieldset', () => {
  let component: Fieldset;
  let fixture: ComponentFixture<Fieldset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fieldset]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fieldset);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

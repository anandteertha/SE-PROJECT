import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DietaryPreference } from '@enums/dietary-preference';
import { SaltLevel } from '@enums/salt-level';
import { Customizations } from '@modules/settings/customizations/customizations';

describe('Customizations', () => {
  let customizationsComponent: Customizations;
  let customizationsFixture: ComponentFixture<Customizations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customizations]
    })
      .compileComponents();

    customizationsFixture = TestBed.createComponent(Customizations);
    customizationsComponent = customizationsFixture.componentInstance;
    customizationsFixture.detectChanges();
  });

  it('should create', () => {
    expect(customizationsComponent).toBeTruthy();
  });

  describe('formatLabel() spec suite', () => {
    it('should return a string with % sign attached to it', () => {
      expect(customizationsComponent.formatLabel(10)).toEqual("10%");
    });
  });

  describe('defaultCustomization() spec suite', () => {
    it('should return Customization object with default values in it', () => {
      expect(customizationsComponent.defaultCustomization).toEqual({
        Spiciness: 50,
        Sweetness: 50,
        Salt: SaltLevel.Medium,
        DietaryPreference: DietaryPreference.NonVegetarian,
      });
    });
  });

  describe('bindFields() spec suite', () => {
    it('should set value for spiciness', () => {
      customizationsComponent.formGroup.controls.Spiciness.setValue(10);
      expect(customizationsComponent.customization.Spiciness).toEqual(10);
    });
    it('should set value for sweetness', () => {
      customizationsComponent.formGroup.controls.Sweetness.setValue(10);
      expect(customizationsComponent.customization.Sweetness).toEqual(10);
    });
    it('should set value for dietary preference', () => {
      customizationsComponent.formGroup.controls.DietaryPreference.setValue(DietaryPreference.SwamiNarayan);
      expect(customizationsComponent.customization.DietaryPreference).toEqual(DietaryPreference.SwamiNarayan);
    });
    it('should set value for salt', () => {
      customizationsComponent.formGroup.controls.Salt.setValue(SaltLevel.Low);
      expect(customizationsComponent.customization.Salt).toEqual(SaltLevel.Low);
    });
  });
});

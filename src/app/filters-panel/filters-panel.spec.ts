import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FilterCriteria, FiltersPanelComponent, SaltLevel } from '@app/filters-panel/filters-panel';

describe('FiltersPanelComponent', () => {
  let fixture: any;
  let filtersPanelComponent: FiltersPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersPanelComponent],
      providers: [provideZonelessChangeDetection()],
    })
      .overrideComponent(FiltersPanelComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(FiltersPanelComponent);
    filtersPanelComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(filtersPanelComponent).toBeTruthy();
    expect(filtersPanelComponent.showPanel).toBeFalse();
    expect(filtersPanelComponent.selectedCategory).toBe('all');
    expect(filtersPanelComponent.selectedDietaryPreference).toBe('all');
    expect(filtersPanelComponent.selectedSpiciness).toBe(0);
    expect(filtersPanelComponent.selectedSweetness).toBe(0);
    expect(filtersPanelComponent.selectedSalt).toBe('any');
  });

  it('accepts inputs for categories and dietaryPreferences', () => {
    filtersPanelComponent.categories = ['Curry', 'Starter'];
    filtersPanelComponent.dietaryPreferences = ['VEG', 'NON_VEG'];
    fixture.detectChanges();
    expect(filtersPanelComponent.categories).toEqual(['Curry', 'Starter']);
    expect(filtersPanelComponent.dietaryPreferences).toEqual(['VEG', 'NON_VEG']);
  });

  it('togglePanel flips visibility and closePanel hides it', () => {
    filtersPanelComponent.togglePanel();
    expect(filtersPanelComponent.showPanel).toBeTrue();
    filtersPanelComponent.togglePanel();
    expect(filtersPanelComponent.showPanel).toBeFalse();
    filtersPanelComponent.togglePanel();
    expect(filtersPanelComponent.showPanel).toBeTrue();
    filtersPanelComponent.closePanel();
    expect(filtersPanelComponent.showPanel).toBeFalse();
  });

  it('onCategory, onDietaryPreferenceChange, onSalt update selections', () => {
    filtersPanelComponent.onCategory('Starter');
    filtersPanelComponent.onDietaryPreferenceChange('NON_VEG');
    filtersPanelComponent.onSalt('high');
    expect(filtersPanelComponent.selectedCategory).toBe('Starter');
    expect(filtersPanelComponent.selectedDietaryPreference).toBe('NON_VEG');
    expect(filtersPanelComponent.selectedSalt).toBe('high');
  });

  it('apply emits current criteria and closes the panel', () => {
    const emitted: FilterCriteria[] = [];
    filtersPanelComponent.filterChange.subscribe((v) => emitted.push(v));

    filtersPanelComponent.showPanel = true;
    filtersPanelComponent.selectedCategory = 'Curry';
    filtersPanelComponent.selectedDietaryPreference = 'VEG';
    filtersPanelComponent.selectedSpiciness = 70;
    filtersPanelComponent.selectedSweetness = 20;
    filtersPanelComponent.selectedSalt = 'less';

    filtersPanelComponent.apply();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({
      category: 'Curry',
      dietaryPreference: 'VEG',
      spiciness: 70,
      sweetness: 20,
      salt: 'less',
    });
    expect(filtersPanelComponent.showPanel).toBeFalse();
  });

  it('reset restores defaults, emits, and closes', () => {
    const emitted: FilterCriteria[] = [];
    filtersPanelComponent.filterChange.subscribe((v) => emitted.push(v));

    filtersPanelComponent.showPanel = true;
    filtersPanelComponent.selectedCategory = 'Starter';
    filtersPanelComponent.selectedDietaryPreference = 'NON_VEG';
    filtersPanelComponent.selectedSpiciness = 90;
    filtersPanelComponent.selectedSweetness = 10;
    filtersPanelComponent.selectedSalt = 'high';

    filtersPanelComponent.reset();

    expect(filtersPanelComponent.selectedCategory).toBe('all');
    expect(filtersPanelComponent.selectedDietaryPreference).toBe('Vegetarian'); // as in component code
    expect(filtersPanelComponent.selectedSpiciness).toBe(5);
    expect(filtersPanelComponent.selectedSweetness).toBe(5);
    expect(filtersPanelComponent.selectedSalt).toBe('Medium' as SaltLevel); // as in component code
    expect(filtersPanelComponent.showPanel).toBeFalse();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({
      category: 'all',
      dietaryPreference: 'Vegetarian',
      spiciness: 5,
      sweetness: 5,
      salt: 'Medium' as SaltLevel,
    });
  });
});

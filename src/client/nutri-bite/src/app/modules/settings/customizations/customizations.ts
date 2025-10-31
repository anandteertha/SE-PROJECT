import { Subject, takeUntil } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { DietaryPreference } from '@enums/dietary-preference';
import { SaltLevel } from '@enums/salt-level';
import { Customization } from '@models/customization';
import { CustomizationForm } from '@models/customization-form';
import { Fieldset } from '@shared/fieldset/fieldset';

@Component({
  selector: 'app-customizations',
  imports: [MatTabsModule, MatSliderModule, Fieldset, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './customizations.html',
  styleUrl: './customizations.scss'
})
export class Customizations implements OnInit, OnDestroy {
  formGroup: FormGroup<CustomizationForm> = new FormGroup({
    Spiciness: new FormControl<number>(50, { nonNullable: true }),
    Sweetness: new FormControl<number>(50, { nonNullable: true }),
    Salt: new FormControl<SaltLevel>(SaltLevel.Medium, { nonNullable: true }),
    DietaryPreference: new FormControl<DietaryPreference>(DietaryPreference.NonVegetarian, { nonNullable: true }),
  });
  customization: Customization = this.defaultCustomization;
  destroyed: Subject<boolean> = new Subject<boolean>();
  saltLevel: SaltLevel[] = [SaltLevel.High, SaltLevel.Low, SaltLevel.Medium];
  dietaryPreferences: DietaryPreference[] = [DietaryPreference.GlutenFree, DietaryPreference.Halal, DietaryPreference.Jain, DietaryPreference.Kosher, DietaryPreference.NonVegetarian, DietaryPreference.SwamiNarayan, DietaryPreference.Vegan, DietaryPreference.Vegetarian];


  private bindFields(): void {
    this.formGroup.controls.Spiciness
      .valueChanges
      .pipe(
        takeUntil(this.destroyed)
      ).subscribe(value => {
        this.customization.Spiciness = +value;
        console.log(this.customization)
      });

    this.formGroup.controls.Sweetness
      .valueChanges
      .pipe(
        takeUntil(this.destroyed)
      )
      .subscribe(value => this.customization.Sweetness = +value);

    this.formGroup.controls.Salt.valueChanges.pipe(
      takeUntil(this.destroyed)
    ).subscribe(value => this.customization.Salt = value);

    this.formGroup.controls.DietaryPreference.valueChanges.pipe(
      takeUntil(this.destroyed)
    ).subscribe(value => this.customization.DietaryPreference = value);
  }

  get defaultCustomization(): Customization {
    return {
      Spiciness: 50,
      Sweetness: 50,
      Salt: SaltLevel.Medium,
      DietaryPreference: DietaryPreference.NonVegetarian,
    }
  }

  ngOnInit(): void {
    this.bindFields();
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }
}

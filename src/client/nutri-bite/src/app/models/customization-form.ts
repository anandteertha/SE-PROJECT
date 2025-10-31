import { FormControl } from '@angular/forms';
import { DietaryPreference } from '@enums/dietary-preference';
import { SaltLevel } from '@enums/salt-level';

export interface CustomizationForm {
    Spiciness: FormControl<number>;
    Sweetness: FormControl<number>;
    Salt: FormControl<SaltLevel>;
    DietaryPreference: FormControl<DietaryPreference>;
}

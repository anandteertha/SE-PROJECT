import { DietaryPreference } from '@enums/dietary-preference';
import { SaltLevel } from '@enums/salt-level';

export interface Customization {
    Spiciness: number;
    Sweetness: number;
    Salt: SaltLevel;
    DietaryPreference: DietaryPreference;
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SaltLevel = 'any' | 'less' | 'medium' | 'high';

export interface FilterCriteria {
  category: string;
  dietaryPreference: string;
  spiciness: number;
  sweetness: number;
  salt: SaltLevel;
}

@Component({
  selector: 'app-filters-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss'],
})
export class FiltersPanelComponent {
  showPanel = false;
  @Input() selectedCategory: string = 'all';
  @Input() selectedDietaryPreference: string = 'all';
  @Input() selectedSpiciness: number = 0;
  @Input() selectedSweetness: number = 0;
  @Input() selectedSalt: SaltLevel = 'any';
  @Input() categories: string[] = [];
  @Input() dietaryPreferences: string[] = [];
  @Output() filterChange = new EventEmitter<FilterCriteria>();

  togglePanel() {
    this.showPanel = !this.showPanel;
  }

  closePanel() {
    this.showPanel = false;
  }

  onCategory(category: string) {
    this.selectedCategory = category;
  }

  onDietaryPreferenceChange(dietaryPreference: string) {
    this.selectedDietaryPreference = dietaryPreference;
  }

  onSalt(level: SaltLevel) {
    this.selectedSalt = level;
  }

  apply() {
    this.emit();
    this.closePanel();
  }

  reset() {
    this.selectedCategory = 'all';
    this.selectedDietaryPreference = 'all';
    this.selectedSpiciness = 0;
    this.selectedSweetness = 0;
    this.selectedSalt = 'any';
    this.emit();
    this.closePanel();
  }

  private emit() {
    this.filterChange.emit({
      category: this.selectedCategory,
      dietaryPreference: this.selectedDietaryPreference,
      spiciness: this.selectedSpiciness,
      sweetness: this.selectedSweetness,
      salt: this.selectedSalt,
    });
  }
}

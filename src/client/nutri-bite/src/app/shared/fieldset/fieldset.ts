import { Component, Input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-fieldset',
  imports: [MatSliderModule],
  templateUrl: './fieldset.html',
  styleUrl: './fieldset.scss'
})
export class Fieldset {
  @Input() legend: string = "";
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-revolving-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revolving-button.component.html',
  styleUrls: ['./revolving-button.component.scss']
})
export class RevolvingButtonComponent {
  @Input() text = '';
  @Input() icon = '';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-revolving-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revolving-button.html',
  styleUrls: ['./revolving-button.scss'],
})
export class RevolvingButtonComponent {
  @Input() text = '';
  @Input() icon = '';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}

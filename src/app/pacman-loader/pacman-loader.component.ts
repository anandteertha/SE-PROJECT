import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pacman-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pacman-loader.component.html',
  styleUrls: ['./pacman-loader.component.scss']
})
export class PacmanLoaderComponent {
  constructor() {}
}

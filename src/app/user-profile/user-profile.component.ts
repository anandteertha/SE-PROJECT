import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  @Output() action = new EventEmitter<string>();

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  get displayName(): string {
    const userJson = localStorage.getItem('user');
    if (!userJson) return 'Guest';

    const user = JSON.parse(userJson);
    const emailName = user.email ? user.email.split('@')[0] : undefined;
    return user.name || emailName || 'You';
  }

  onPrimaryClick() {
    this.action.emit(this.isAuthenticated ? 'profile' : 'login');
  }

  onSignOut() {
    localStorage.removeItem('user');
    this.action.emit('signed-out');
  }
}

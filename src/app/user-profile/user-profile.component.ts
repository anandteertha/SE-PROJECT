import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @Output() action = new EventEmitter<string>();

  get isAuthenticated(): boolean {
    try {
      return !!localStorage.getItem('user');
    } catch (e) {
      return false;
    }
  }

  get displayName(): string {
    if (this.isAuthenticated) {
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        const emailName = u?.email ? u.email.split('@')[0] : undefined;
        return u?.name || emailName || 'You';
      } catch {
        return 'You';
      }
    }
    return 'Guest';
  }

  onPrimaryClick() {
    if (this.isAuthenticated) {
      this.action.emit('profile');
    } else {
      this.action.emit('login');
    }
  }

  onSignOut() {
    localStorage.removeItem('user');
    this.action.emit('signed-out');
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

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
    const user = localStorage.getItem('user');
    const email = localStorage.getItem('user');
    if (!user) return 'Guest';

    const emailName = email ? email.split('@')[0] : undefined;
    return user || emailName || 'You';
  }

  onPrimaryClick() {
    this.action.emit(this.isAuthenticated ? 'profile' : 'login');
  }

  onSignOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    this.action.emit('signed-out');
  }
}

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';

describe('UserProfileComponent', () => {
  let userProfileComponent: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    userProfileComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(userProfileComponent).toBeTruthy();
  });

  it('should show "Guest" when no user in localStorage', () => {
    localStorage.removeItem('user');
    expect(userProfileComponent.displayName).toBe('Guest');
    expect(userProfileComponent.isAuthenticated).toBe(false);
  });

  it('should show user name when user exists in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
    expect(userProfileComponent.displayName).toBe('Alice');
    expect(userProfileComponent.isAuthenticated).toBe(true);
    localStorage.removeItem('user');
  });

  it('should emit "login" action when guest clicks profile', () => {
    localStorage.removeItem('user');
    spyOn(userProfileComponent.action, 'emit');
    userProfileComponent.onPrimaryClick();
    expect(userProfileComponent.action.emit).toHaveBeenCalledWith('login');
  });

  it('should emit "profile" action when authenticated user clicks profile', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Bob' }));
    spyOn(userProfileComponent.action, 'emit');
    userProfileComponent.onPrimaryClick();
    expect(userProfileComponent.action.emit).toHaveBeenCalledWith('profile');
    localStorage.removeItem('user');
  });

  it('should clear user from localStorage on sign out', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Charlie' }));
    spyOn(userProfileComponent.action, 'emit');
    userProfileComponent.onSignOut();
    expect(localStorage.getItem('user')).toBeNull();
    expect(userProfileComponent.action.emit).toHaveBeenCalledWith('signed-out');
  });
});

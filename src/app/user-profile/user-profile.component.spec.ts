import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show "Guest" when no user in localStorage', () => {
    localStorage.removeItem('user');
    expect(component.displayName).toBe('Guest');
    expect(component.isAuthenticated).toBe(false);
  });

  it('should show user name when user exists in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
    expect(component.displayName).toBe('Alice');
    expect(component.isAuthenticated).toBe(true);
    localStorage.removeItem('user');
  });

  it('should emit "login" action when guest clicks profile', () => {
    localStorage.removeItem('user');
    spyOn(component.action, 'emit');
    component.onPrimaryClick();
    expect(component.action.emit).toHaveBeenCalledWith('login');
  });

  it('should emit "profile" action when authenticated user clicks profile', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Bob' }));
    spyOn(component.action, 'emit');
    component.onPrimaryClick();
    expect(component.action.emit).toHaveBeenCalledWith('profile');
    localStorage.removeItem('user');
  });

  it('should clear user from localStorage on sign out', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Charlie' }));
    spyOn(component.action, 'emit');
    component.onSignOut();
    expect(localStorage.getItem('user')).toBeNull();
    expect(component.action.emit).toHaveBeenCalledWith('signed-out');
  });
});

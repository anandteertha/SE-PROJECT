# User Profile Component

**Location:** `src/app/user-profile/`

## Overview
An animated, theme-aware user profile button that displays in the header alongside the cart. Blends with both light and dark modes using gradient backgrounds and glow effects.

### Features
- **Guest Mode**: Shows "Guest" with a pulsing pink gradient when no user is logged in
- **Authenticated Mode**: Shows user's name/avatar with purple gradient; hover to reveal dropdown menu
- **Animations**:
  - Rotating avatar with glow ring pulse
  - Shimmer effect on button hover
  - Smooth dropdown slide-in
  - Bounce effect on hover states
- **Dark Mode**: Automatically adapts dropdown menu colors based on `.dark-mode` class
- **Responsive**: Truncates long usernames with ellipsis

## Usage
```html
<app-user-profile (action)="handleProfileAction($event)"></app-user-profile>
```

### Events
The component emits an `action` event with these possible values:
- `'login'` – Guest user clicked profile (navigate to login page)
- `'profile'` – Authenticated user clicked avatar (navigate to profile page)
- `'settings'` – User clicked Settings in dropdown
- `'orders'` – User clicked My Orders in dropdown
- `'signed-out'` – User clicked Sign Out

### Authentication Integration
Currently uses **localStorage** for lightweight guest detection:
- **`localStorage.getItem('user')`** – Expected to be a JSON object with `name` and/or `email`
- **Other team**: Wire your authentication service by listening to `(action)` events and handling routing/auth flow

Example:
```typescript
onProfileAction(action: string) {
  if (action === 'login') {
    this.router.navigate(['/login']);
  } else if (action === 'signed-out') {
    this.authService.signOut();
  }
  // ... etc
}
```

## Styling
- **Light mode**: White dropdown with subtle purple hover highlights
- **Dark mode**: Dark grey (#2d2d2d) dropdown with lighter hover states
- **Color palette**:
  - Authenticated: Purple gradient (#667eea → #764ba2)
  - Guest: Pink gradient (#f093fb → #f5576c)

## Testing
Run tests with:
```bash
npm test
```
Tests verify guest/authenticated states, event emissions, and localStorage interactions.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';  // <-- Import forms
import { RouterModule } from '@angular/router'; // For the "login" link
import { HttpClient } from '@angular/common/http'; // <-- Import HttpClient

// Import all the Material modules you need
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-register',
  standalone: true, // Make it standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './register.html', // Use 'register.html'
  styleUrls: ['./register.scss'] // Use 'register.scss'
})


export class Register { // The class is 'Register'
    
    registerForm = new FormGroup(
      {
        // --- Your controls (these don't change) ---
        name: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$')
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        termsAccepted: new FormControl(false, [Validators.requiredTrue])
      },
      // --- ADD THIS "options" OBJECT ---
      { validators: passwordsMatchValidator }
    );

  // 1. Add a constructor to "inject" the HttpClient
  constructor(private http: HttpClient) {}

  onSubmit() {
    // when the form is submitted
    if (this.registerForm.valid) {
      console.log('Form is valid. Sending to backend...');
      this.http.post('http://127.0.0.1:5000/register', this.registerForm.value)
        .subscribe({
          next: (response) => {
            console.log('Success!', response);
          },
          error: (error) => {
            console.error('Error!', error);
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }
}

/**
 * Custom validator to check if two fields match.
 */
export const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  // Get the password and confirmPassword controls
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // If controls don't exist, or values are empty, don't validate
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }

  // If they match, return null (no error).
  // If they don't match, return an error object.
  return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
};


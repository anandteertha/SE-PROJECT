import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import {
    AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { UserDetails } from '@app/models/user-details';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register implements OnDestroy {
  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$'),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      termsAccepted: new FormControl(false, [Validators.requiredTrue]),
    },
    { validators: passwordsMatchValidator }
  );
  destroyed: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.registerForm.invalid || !this.registerForm.errors) {
      console.log('Form is valid. Sending to backend...');
      const userDetails: UserDetails = {
        Name: this.registerForm.get('name')?.value || '',
        Password: this.registerForm.get('password')?.value || '',
        Email: this.registerForm.get('email')?.value || '',
      };
      this.http
        .post(`${environment.apiBase}/register`, userDetails)
        .pipe(takeUntil(this.destroyed))
        .subscribe({
          next: (response) => {
            console.log('Success!', response);
          },
          error: (error) => {
            console.error('Error!', error);
          },
          complete: () => {
            this.router.navigate(['/login']);
          },
        });
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }
}

export const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }
  return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
};

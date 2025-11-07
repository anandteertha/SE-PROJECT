import { environment } from 'environments/environment';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { UserDetails } from '@app/models/user-details';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm = new FormGroup({
    loginId: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.loginForm.valid) {
      console.log('Login Form is invalid');
      return;
    }

    console.log('Login Form is valid. Sending to backend...');
    const userDetails: UserDetails = {
      Name: this.loginForm.get('loginId')?.value || '',
      Password: this.loginForm.get('password')?.value || '',
      Email: this.loginForm.get('loginId')?.value || '',
    };
    this.http.post<any>(`${environment.apiBase}/login`, userDetails).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', response.username);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('email', response.email);

        this.router.navigate(['/menu']);
      },
      error: (error) => {
        console.error('Login Error!', error);
      },
    });
  }
}

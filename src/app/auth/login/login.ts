import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Import all the Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm = new FormGroup({
    loginId: new FormControl('', [Validators.required]), 
    password: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.loginForm.valid) {
      console.log('Login Form is invalid');
      return;
    }

    console.log('Login Form is valid. Sending to backend...');

    this.http.post<any>('http://127.0.0.1:5000/login', this.loginForm.value)
      .subscribe({
        next: (response) => {
          console.log('Login Success!', response);

          localStorage.setItem('token', response.token); 
          localStorage.setItem('username', response.username);

          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login Error!', error);
        }
      });
  }
}
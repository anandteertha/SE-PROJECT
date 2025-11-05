import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; // For the "register" link
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Import all the Material modules you need
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true, // Make it standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html', // Use 'login.html'
  styleUrls: ['./login.scss'] // Use 'login.scss'
})

export class Login { 

  // Create the form group
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Form is valid. Sending to backend...');
      
      // 2. Use HttpClient to send the form value to Flask API
      this.http.post<any>('http://127.0.0.1:5000/login', this.loginForm.value)
        .subscribe({
          next: (response) => {
            console.log('Login Success!', response);

            //save the token
            localStorage.setItem('token', response.token);

            //save the username
            localStorage.setItem('username', response.username)

            this.router.navigate(['/home']);

          },
          error: (error) => {
            console.error('Login Error!', error);
          }
        });

    } else {
      console.log('Login Form is invalid');
    }
  }
}
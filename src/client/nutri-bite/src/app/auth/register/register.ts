import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';  // <-- Import forms
import { RouterModule } from '@angular/router'; // For the "login" link
import { HttpClient } from '@angular/common/http'; // <-- Import HttpClient

// Import all the Material modules you need
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  templateUrl: './register.html', // Use 'register.html'
  styleUrls: ['./register.scss'] // Use 'register.scss'
})
export class Register { // The class is 'Register'
    
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

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
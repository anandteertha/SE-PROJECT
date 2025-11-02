import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; // For the "register" link
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
export class Login { // The class is 'Login'

  // Create the form group
  loginForm = new FormGroup({
    // We can just call this 'email' for simplicity
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Form is valid');
      console.log(this.loginForm.value);
    } else {
      console.log('Login Form is invalid');
    }
  }
}
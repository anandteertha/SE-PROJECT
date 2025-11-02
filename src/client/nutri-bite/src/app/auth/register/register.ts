import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; // For the "login" link
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    MatButtonModule
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

  onSubmit() {
    // This will run when the form is submitted
    if (this.registerForm.valid) {
      console.log('Form is valid');
      console.log(this.registerForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
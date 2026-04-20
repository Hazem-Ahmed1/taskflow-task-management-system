import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  get passwordStrength(): 'weak' | 'fair' | 'strong' | '' {
    if (!this.password) return '';
    if (this.password.length < 6) return 'weak';
    if (this.password.length < 10) return 'fair';
    return 'strong';
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.name.trim()) {
      this.errorMessage = 'Please enter your full name.';
      return;
    }
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const result = this.auth.register({
        name: this.name.trim(),
        email: this.email.trim(),
        password: this.password
      });
      this.isLoading = false;

      if (result.success) {
        this.router.navigate(['/boards']);
      } else {
        this.errorMessage = result.error ?? 'Registration failed. Please try again.';
      }
    }, 400);
  }
}

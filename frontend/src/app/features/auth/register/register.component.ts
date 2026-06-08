import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);

  get passwordStrength(): 'weak' | 'fair' | 'strong' | '' {
    const p = this.password();
    if (!p) return '';
    if (p.length < 6) return 'weak';
    if (p.length < 10) return 'fair';
    return 'strong';
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.name().trim()) {
      this.errorMessage.set('Please enter your full name.');
      return;
    }
    if (!this.email().trim()) {
      this.errorMessage.set('Please enter your email address.');
      return;
    }
    if (this.password().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);
    this.auth.register({ name: this.name().trim(), email: this.email().trim(), password: this.password() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/boards']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Registration failed. Please try again.');
      }
    });
  }
}

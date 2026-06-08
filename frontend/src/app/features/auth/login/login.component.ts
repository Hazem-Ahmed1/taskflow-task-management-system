import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = signal('');
  password = signal('');
  showPassword = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);

  readonly demoAccounts = [
    { email: 'hazem@taskflow.io',  password: 'hazem123',  name: 'Hazem' },
    { email: 'sara@taskflow.io',   password: 'sara123',   name: 'Sara' },
    { email: 'nour@taskflow.io',   password: 'nour123',   name: 'Nour' },
    { email: 'khaled@taskflow.io', password: 'khaled123', name: 'Khaled' },
    { email: 'lina@taskflow.io',   password: 'lina123',   name: 'Lina' }
  ];

  constructor() {
    const prefill = this.route.snapshot.queryParamMap.get('email');
    if (prefill) {
      this.email.set(prefill);
      const match = this.demoAccounts.find(a => a.email === prefill);
      if (match) this.password.set(match.password);
    }
  }

  fillDemo(account: { email: string; password: string }): void {
    this.email.set(account.email);
    this.password.set(account.password);
    this.errorMessage.set('');
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.email().trim()) {
      this.errorMessage.set('Please enter your email address.');
      return;
    }
    if (!this.password()) {
      this.errorMessage.set('Please enter your password.');
      return;
    }

    this.isLoading.set(true);
    this.auth.login({ email: this.email().trim(), password: this.password() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/boards']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Login failed. Please check your credentials.');
      }
    });
  }
}

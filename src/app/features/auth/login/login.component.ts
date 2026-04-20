import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  readonly demoAccounts = [
    { email: 'hazem@taskflow.io',  password: 'hazem123',  name: 'Hazem' },
    { email: 'khaled@taskflow.io', password: 'khaled123', name: 'Khaled' },
    { email: 'sara@taskflow.io',   password: 'sara123',   name: 'Sara' },
    { email: 'ahmed@taskflow.io',  password: 'ahmed123',  name: 'Ahmed' },
    { email: 'demo@taskflow.io',   password: 'demo123',   name: 'Demo User' }
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Pre-fill email when coming from landing page quick-login
    const prefill = this.route.snapshot.queryParamMap.get('email');
    if (prefill) {
      this.email = prefill;
      const match = this.demoAccounts.find(a => a.email === prefill);
      if (match) this.password = match.password;
    }
  }

  fillDemo(account: { email: string; password: string }): void {
    this.email = account.email;
    this.password = account.password;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const result = this.auth.login({ email: this.email.trim(), password: this.password });
      this.isLoading = false;

      if (result.success) {
        this.router.navigate(['/boards']);
      } else {
        this.errorMessage = result.error ?? 'Login failed. Please try again.';
      }
    }, 400);
  }
}

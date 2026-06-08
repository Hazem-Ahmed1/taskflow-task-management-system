import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User, LoginCredentials, RegisterData } from '../models';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'taskflow_token';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.restoreSession();
  }

  login(credentials: LoginCredentials) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.startSession(res))
    );
  }

  register(data: RegisterData) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(res => this.startSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private startSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    this.currentUser.set(res.user);
  }

  private restoreSession(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    // Token exists; restore user from the me endpoint or decode JWT
    this.http.get<User>(`${environment.apiUrl}/users/me`).subscribe({
      next: user => this.currentUser.set(user),
      error: () => {
        localStorage.removeItem(TOKEN_KEY);
        this.currentUser.set(null);
      }
    });
  }
}

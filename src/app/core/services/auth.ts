import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials, RegisterData, AuthResult, AuthSession } from '../models';
import { DatabaseService } from './database';

const SESSION_KEY = 'taskflow_session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private db: DatabaseService, private router: Router) {
    this.restoreSession();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(credentials: LoginCredentials): AuthResult {
    const dbUser = this.db.getUserByEmail(credentials.email);

    if (!dbUser) {
      return { success: false, error: 'No account found with that email address.' };
    }
    if (dbUser['password'] !== credentials.password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    this.startSession(dbUser);
    return { success: true };
  }

  register(data: RegisterData): AuthResult {
    if (this.db.getUserByEmail(data.email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (data.name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' };
    }
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const newUser = {
      id: this.db.generateId('user'),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: 'member',
      createdAt: new Date().toISOString()
    };

    this.db.createUser(newUser);
    this.startSession(newUser);
    return { success: true };
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ─── Session ─────────────────────────────────────────────────────────────

  private startSession(dbUser: Record<string, unknown>): void {
    const session: AuthSession = {
      userId: dbUser['id'] as string,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.currentUserSubject.next(this.toPublicUser(dbUser));
  }

  private restoreSession(): void {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const session = JSON.parse(raw) as AuthSession;
      const dbUser = this.db.getUserById(session.userId);
      if (dbUser) {
        this.currentUserSubject.next(this.toPublicUser(dbUser));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private toPublicUser(raw: Record<string, unknown>): User {
    return {
      id: raw['id'] as string,
      name: raw['name'] as string,
      email: raw['email'] as string,
      role: 'member',
      avatar: raw['avatar'] as string | undefined,
      createdAt: new Date(raw['createdAt'] as string)
    };
  }
}

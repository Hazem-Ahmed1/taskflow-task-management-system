import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { User } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  users = signal<User[]>([]);

  loadAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`).pipe(
      tap(users => this.users.set(users))
    );
  }

  searchUsers(query: string) {
    return this.http.get<User[]>(`${environment.apiUrl}/users/search?q=${encodeURIComponent(query)}`);
  }

  getUserById(id: string): User | undefined {
    return this.users().find(u => u.id === id);
  }
}

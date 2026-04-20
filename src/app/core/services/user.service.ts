import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private db: DatabaseService) {
    this.loadUsers();
  }

  private loadUsers(): void {
    const users: User[] = this.db.getUsers().map(u => ({
      id: u['id'] as string,
      name: u['name'] as string,
      email: u['email'] as string,
      role: 'member',
      avatar: u['avatar'] as string | undefined,
      createdAt: new Date(u['createdAt'] as string)
    }));
    this.usersSubject.next(users);
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: string): User | undefined {
    return this.usersSubject.value.find(u => u.id === id);
  }

  searchUsers(query: string): User[] {
    const q = query.toLowerCase();
    return this.usersSubject.value.filter(
      u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  refresh(): void {
    this.loadUsers();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models';

/**
 * UserService - Manages user data and authentication
 * 
 * Architecture:
 * - Maintains current user state
 * - Provides user lookup functionality
 * - Manages user-related operations
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private usersSubject = new BehaviorSubject<User[]>([]);

  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor() {
    this.initializeMockUsers();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Set current user
   */
  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): User | undefined {
    return this.usersSubject.value.find(user => user.id === id);
  }

  /**
   * Search users by name or email
   */
  searchUsers(query: string): User[] {
    const lowerQuery = query.toLowerCase();
    return this.usersSubject.value.filter(
      user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Initialize mock users
   */
  private initializeMockUsers(): void {
    const mockUsers: User[] = [
      {
        id: 'user_1',
        name: 'Hazem Ahmed',
        email: 'haazm.994@gmail.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        createdAt: new Date('2025-12-01')
      },
      {
        id: 'user_2',
        name: 'Khaled Ashraf',
        email: 'khale.ashraf@gmail.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
        createdAt: new Date('2025-12-05')
      },
      {
        id: 'user_3',
        name: 'mohamed',
        email: 'mohamed@gmail.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
        createdAt: new Date('2025-12-10')
      },
      {
        id: 'user_4',
        name: 'Hend mohamed',
        email: 'hend.mohamed@gmail.com',
        avatar: 'https://i.pravatar.cc/150?img=4',
        createdAt: new Date('2025-12-15')
      }
    ];

    this.usersSubject.next(mockUsers);
    this.currentUserSubject.next(mockUsers[0]); // Set first user as current
  }
}

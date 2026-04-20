import { Injectable } from '@angular/core';
import { SEED_DATA } from '../data/seed-data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface DatabaseSchema {
  users: AnyRecord[];
  boards: AnyRecord[];
  notifications: AnyRecord[];
}

const DB_KEY = 'taskflow_db_v2';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.load();
  }

  // ─── Internal Load / Save ────────────────────────────────────────────────

  private load(): DatabaseSchema {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as DatabaseSchema;
      } catch {
        // Corrupt data - reseed
      }
    }
    const seeded = this.buildSeed();
    this.persist(seeded);
    return seeded;
  }

  private persist(data: DatabaseSchema): void {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    this.db = data;
  }

  private save(): void {
    this.persist(this.db);
  }

  /** Clears localStorage and reseeds from the TypeScript seed file */
  resetDatabase(): void {
    const fresh = this.buildSeed();
    this.persist(fresh);
  }

  private buildSeed(): DatabaseSchema {
    // Deep-clone to avoid mutating the constant
    return JSON.parse(JSON.stringify(SEED_DATA)) as DatabaseSchema;
  }

  // ─── Users ───────────────────────────────────────────────────────────────

  getUsers(): AnyRecord[] {
    return this.db.users;
  }

  getUserById(id: string): AnyRecord | undefined {
    return this.db.users.find((u: AnyRecord) => u['id'] === id);
  }

  getUserByEmail(email: string): AnyRecord | undefined {
    return this.db.users.find(
      (u: AnyRecord) => (u['email'] as string).toLowerCase() === email.toLowerCase()
    );
  }

  createUser(user: AnyRecord): void {
    this.db.users.push(user);
    this.save();
  }

  updateUser(id: string, updates: AnyRecord): void {
    this.db.users = this.db.users.map((u: AnyRecord) =>
      u['id'] === id ? { ...u, ...updates } : u
    );
    this.save();
  }

  // ─── Boards ──────────────────────────────────────────────────────────────

  getBoards(): AnyRecord[] {
    return this.db.boards;
  }

  getBoardById(id: string): AnyRecord | undefined {
    return this.db.boards.find((b: AnyRecord) => b['id'] === id);
  }

  getBoardsByUser(userId: string): AnyRecord[] {
    return this.db.boards.filter(
      (b: AnyRecord) =>
        b['ownerId'] === userId ||
        (b['members'] as string[]).includes(userId)
    );
  }

  createBoard(board: AnyRecord): void {
    this.db.boards.push(board);
    this.save();
  }

  updateBoard(id: string, updates: AnyRecord): void {
    this.db.boards = this.db.boards.map((b: AnyRecord) =>
      b['id'] === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
    );
    this.save();
  }

  deleteBoard(id: string): void {
    this.db.boards = this.db.boards.filter((b: AnyRecord) => b['id'] !== id);
    this.save();
  }

  // ─── Notifications ───────────────────────────────────────────────────────

  getNotificationsByUser(userId: string): AnyRecord[] {
    return this.db.notifications.filter((n: AnyRecord) => n['userId'] === userId);
  }

  createNotification(notification: AnyRecord): void {
    this.db.notifications.unshift(notification);
    this.save();
  }

  updateNotification(id: string, updates: AnyRecord): void {
    this.db.notifications = this.db.notifications.map((n: AnyRecord) =>
      n['id'] === id ? { ...n, ...updates } : n
    );
    this.save();
  }

  deleteNotification(id: string): void {
    this.db.notifications = this.db.notifications.filter((n: AnyRecord) => n['id'] !== id);
    this.save();
  }

  markAllNotificationsRead(userId: string): void {
    this.db.notifications = this.db.notifications.map((n: AnyRecord) =>
      n['userId'] === userId ? { ...n, isRead: true } : n
    );
    this.save();
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

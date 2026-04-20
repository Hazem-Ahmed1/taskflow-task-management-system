import { Injectable } from '@angular/core';
import { ActivityEntry, ActivityAction } from '../models/activity.model';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private static readonly KEY = 'taskflow_activities_v2';
  private _entries: ActivityEntry[] = [];

  constructor(private auth: AuthService) {
    this._load();
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  log(
    action: ActivityAction,
    description: string,
    meta?: { boardId?: string; boardTitle?: string; cardId?: string }
  ): void {
    const userId = this.auth.currentUser?.id;
    if (!userId) return;

    const entry: ActivityEntry = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId,
      action,
      description,
      createdAt: new Date(),
      ...meta
    };

    this._entries.unshift(entry);
    if (this._entries.length > 300) this._entries = this._entries.slice(0, 300);
    this._save();
  }

  getAll(): ActivityEntry[] {
    return [...this._entries];
  }

  getForBoard(boardId: string): ActivityEntry[] {
    return this._entries.filter(e => e.boardId === boardId);
  }

  // ─── Persistence ─────────────────────────────────────────────────────────

  private _load(): void {
    try {
      const raw = localStorage.getItem(ActivityService.KEY);
      if (!raw) { this._entries = []; return; }
      this._entries = (JSON.parse(raw) as ActivityEntry[]).map(e => ({
        ...e,
        createdAt: new Date(e.createdAt as unknown as string)
      }));
    } catch {
      this._entries = [];
    }
  }

  private _save(): void {
    localStorage.setItem(ActivityService.KEY, JSON.stringify(this._entries));
  }
}

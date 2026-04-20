import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ActivityService } from '@core/services';
import { BoardService, UserService } from '@core/services';
import { AuthService } from '@core/services/auth';
import { SharedModule } from '@shared/shared.module';
import { ActivityEntry, ActivityAction, User } from '@core/models';

interface GroupedActivity {
  label: string;
  entries: ActivityEntry[];
}

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  groups: GroupedActivity[] = [];

  /** Board IDs the current user can access (own + invited) */
  private userBoardIds = new Set<string>();

  constructor(
    private activityService: ActivityService,
    private boardService: BoardService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Grab the boards that belong to this user
    this.userBoardIds = this.boardService.getUserBoardIds();
    this.refresh();
  }

  refresh(): void {
    const all = this.activityService.getAll();

    // Only show entries that belong to this user's boards (or have no boardId)
    const filtered = all.filter(e =>
      !e.boardId || this.userBoardIds.has(e.boardId)
    );

    this.groups = this.groupByDate(filtered);
  }

  getUser(userId: string): User | undefined {
    return this.userService.getUserById(userId);
  }

  getActorLabel(userId: string): string {
    return userId === this.authService.currentUser?.id
      ? 'You'
      : (this.getUser(userId)?.name ?? 'Someone');
  }

  getIcon(action: ActivityAction): string {
    const map: Record<ActivityAction, string> = {
      [ActivityAction.BOARD_CREATED]:   '🗂️',
      [ActivityAction.BOARD_UPDATED]:   '✏️',
      [ActivityAction.BOARD_DELETED]:   '🗑️',
      [ActivityAction.LIST_CREATED]:    '📋',
      [ActivityAction.LIST_DELETED]:    '🗑️',
      [ActivityAction.CARD_CREATED]:    '🃏',
      [ActivityAction.CARD_DELETED]:    '🗑️',
      [ActivityAction.CARD_COMPLETED]:  '✅',
      [ActivityAction.MEMBER_ASSIGNED]: '👤',
      [ActivityAction.MEMBER_ADDED]:    '➕',
    };
    return map[action] ?? '📌';
  }

  getColorClass(action: ActivityAction): string {
    const creates = [ActivityAction.BOARD_CREATED, ActivityAction.LIST_CREATED, ActivityAction.CARD_CREATED];
    const deletes = [ActivityAction.BOARD_DELETED, ActivityAction.LIST_DELETED, ActivityAction.CARD_DELETED];
    const people  = [ActivityAction.MEMBER_ASSIGNED, ActivityAction.MEMBER_ADDED];

    if (creates.includes(action))         return 'c-green';
    if (deletes.includes(action))         return 'c-red';
    if (action === ActivityAction.CARD_COMPLETED) return 'c-green';
    if (people.includes(action))          return 'c-blue';
    return 'c-purple';
  }

  timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60)  return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)  return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)    return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  navigateToBoard(entry: ActivityEntry): void {
    if (entry.boardId) this.router.navigate(['/boards', entry.boardId]);
  }

  // ─── Grouping ─────────────────────────────────────────────────────────────

  private groupByDate(entries: ActivityEntry[]): GroupedActivity[] {
    const today     = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const map = new Map<string, ActivityEntry[]>();

    for (const e of entries) {
      const d = new Date(e.createdAt);
      let label: string;
      if (this.isSameDay(d, today))     label = 'Today';
      else if (this.isSameDay(d, yesterday)) label = 'Yesterday';
      else label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(e);
    }

    return Array.from(map.entries()).map(([label, ents]) => ({ label, entries: ents }));
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  }
}

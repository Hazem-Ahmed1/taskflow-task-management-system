import { Component, inject, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ActivityService, UserService } from '@core/services';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  private activityService = inject(ActivityService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  groups = computed<GroupedActivity[]>(() =>
    this.groupByDate(this.activityService.activities())
  );

  ngOnInit(): void {
    this.activityService.loadAll().subscribe();
    this.userService.loadAll().subscribe();
  }

  getUser(userId: string): User | undefined {
    return this.userService.getUserById(userId);
  }

  getActorLabel(userId: string): string {
    return userId === this.authService.currentUser()?.id
      ? 'You'
      : (this.getUser(userId)?.name ?? 'Someone');
  }

  getIconClass(action: ActivityAction): string {
    const map: Record<ActivityAction, string> = {
      [ActivityAction.BOARD_CREATED]:   'fa-solid fa-layer-group',
      [ActivityAction.BOARD_UPDATED]:   'fa-solid fa-pen',
      [ActivityAction.BOARD_DELETED]:   'fa-solid fa-trash',
      [ActivityAction.LIST_CREATED]:    'fa-solid fa-list-ul',
      [ActivityAction.LIST_DELETED]:    'fa-solid fa-trash',
      [ActivityAction.CARD_CREATED]:    'fa-solid fa-square-plus',
      [ActivityAction.CARD_DELETED]:    'fa-solid fa-trash',
      [ActivityAction.CARD_COMPLETED]:  'fa-solid fa-circle-check',
      [ActivityAction.MEMBER_ASSIGNED]: 'fa-solid fa-user-tag',
      [ActivityAction.MEMBER_ADDED]:    'fa-solid fa-user-plus',
    };
    return map[action] ?? 'fa-solid fa-thumbtack';
  }

  getColorClass(action: ActivityAction): string {
    const creates = [ActivityAction.BOARD_CREATED, ActivityAction.LIST_CREATED, ActivityAction.CARD_CREATED];
    const deletes = [ActivityAction.BOARD_DELETED, ActivityAction.LIST_DELETED, ActivityAction.CARD_DELETED];
    const people  = [ActivityAction.MEMBER_ASSIGNED, ActivityAction.MEMBER_ADDED];
    if (creates.includes(action)) return 'c-green';
    if (deletes.includes(action)) return 'c-red';
    if (action === ActivityAction.CARD_COMPLETED) return 'c-green';
    if (people.includes(action)) return 'c-blue';
    return 'c-purple';
  }

  timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  navigateToBoard(entry: ActivityEntry): void {
    if (entry.boardId) this.router.navigate(['/boards', entry.boardId]);
  }

  private groupByDate(entries: ActivityEntry[]): GroupedActivity[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const map = new Map<string, ActivityEntry[]>();
    for (const e of entries) {
      const d = new Date(e.createdAt);
      let label: string;
      if (this.isSameDay(d, today)) label = 'Today';
      else if (this.isSameDay(d, yesterday)) label = 'Yesterday';
      else label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(e);
    }
    return Array.from(map.entries()).map(([label, ents]) => ({ label, entries: ents }));
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }
}

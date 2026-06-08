import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Notification, NotificationType } from '@core/models';
import { NotificationService, BoardService, CardNavigationService } from '@core/services';
import { AuthService } from '@core/services/auth';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SharedModule],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss']
})
export class NotificationCenterComponent implements OnInit {
  protected notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private boardService = inject(BoardService);
  private cardNav = inject(CardNavigationService);
  private router = inject(Router);

  notifications = this.notificationService.notifications;
  unreadCount = this.notificationService.unreadCount;
  showPanel = signal(false);

  ngOnInit(): void {
    this.notificationService.loadNotifications().subscribe();
  }

  togglePanel(): void {
    this.showPanel.update(v => !v);
  }

  handleNotificationClick(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
    this.showPanel.set(false);

    if (notification.type === NotificationType.BOARD_INVITATION) {
      this.boardService.loadBoards().subscribe();
      this.router.navigate(['/boards', notification.relatedEntityId]);
      return;
    }

    const cardId = notification.relatedEntityId;
    const board = this.boardService.boards().find(b =>
      this.boardService.selectedBoard()?.lists.some(l => l.cards.some(c => c.id === cardId))
    );

    if (board) {
      this.cardNav.setPendingCard(cardId);
      this.router.navigate(['/boards', board.id]);
    } else {
      this.boardService.loadBoards().subscribe(() => {
        this.router.navigate(['/boards']);
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  getNotificationIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      [NotificationType.CARD_ASSIGNED]: '📋',
      [NotificationType.CARD_UPDATED]: '✏️',
      [NotificationType.CARD_COMMENT]: '💬',
      [NotificationType.DEADLINE_APPROACHING]: '⏰',
      [NotificationType.BOARD_INVITATION]: '📨'
    };
    return icons[type] ?? '📌';
  }
}

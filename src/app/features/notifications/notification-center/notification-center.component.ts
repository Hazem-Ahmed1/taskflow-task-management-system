import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Notification, NotificationType } from '@core/models';
import { NotificationService, BoardService, CardNavigationService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  notifications$!: Observable<Notification[]>;
  showPanel = false;
  unreadCount = 0;

  private sub = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private boardService: BoardService,
    private cardNav: CardNavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.notifications$ = this.notificationService.getNotifications(user.id);
          this.unreadCount = this.notificationService.getUnreadCount(user.id);
        }
      })
    );

    this.sub.add(
      this.notificationService.notifications$.subscribe(() => {
        const userId = this.authService.currentUser?.id;
        if (userId) {
          this.unreadCount = this.notificationService.getUnreadCount(userId);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  togglePanel(): void {
    this.showPanel = !this.showPanel;
  }

  handleNotificationClick(notification: Notification): void {
    // 1. Mark as read
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id);
    }

    // 2. Close the panel
    this.showPanel = false;

    // 3. Navigate to the related entity
    if (notification.type === NotificationType.BOARD_INVITATION) {
      // relatedEntityId is a boardId
      this.router.navigate(['/boards', notification.relatedEntityId]);
      return;
    }

    // For all card-related notifications, relatedEntityId is a cardId
    const cardId = notification.relatedEntityId;
    const boardId = this.boardService.findBoardIdByCardId(cardId);

    if (boardId) {
      // Tell board-content which card to open once the board loads
      this.cardNav.setPendingCard(cardId);
      this.router.navigate(['/boards', boardId]);
    } else {
      // Fallback: go to boards list
      this.router.navigate(['/boards']);
    }
  }

  markAllAsRead(): void {
    const userId = this.authService.currentUser?.id;
    if (userId) {
      this.notificationService.markAllAsRead(userId);
    }
  }

  deleteNotification(event: Event, notificationId: string): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notificationId);
  }

  getNotificationIcon(type: NotificationType): string {
    const icons: { [key in NotificationType]: string } = {
      [NotificationType.CARD_ASSIGNED]: '📋',
      [NotificationType.CARD_UPDATED]: '✏️',
      [NotificationType.CARD_COMMENT]: '💬',
      [NotificationType.DEADLINE_APPROACHING]: '⏰',
      [NotificationType.BOARD_INVITATION]: '📨'
    };
    return icons[type] || '📌';
  }
}

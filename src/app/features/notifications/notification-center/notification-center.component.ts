import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Notification, NotificationType } from '@core/models';
import { NotificationService, UserService } from '@core/services';
import { SharedModule } from '@shared/shared.module';

/**
 * NotificationCenterComponent - Notification dropdown panel
 * 
 * Architecture:
 * - Displays user notifications
 * - Mark as read functionality
 * - Clear notifications
 */
@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss']
})
export class NotificationCenterComponent implements OnInit {
  notifications$!: Observable<Notification[]>;
  showPanel = false;
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.notifications$ = this.notificationService.getNotifications(currentUser.id);
      this.updateUnreadCount(currentUser.id);
    }
  }

  togglePanel(): void {
    this.showPanel = !this.showPanel;
  }

  handleNotificationClick(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id);
      this.updateUnreadCount();
    }
    // TODO: Navigate to related entity (card, board, etc.)
  }

  markAllAsRead(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.notificationService.markAllAsRead(currentUser.id);
      this.updateUnreadCount(currentUser.id);
    }
  }

  deleteNotification(event: Event, notificationId: string): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notificationId);
    this.updateUnreadCount();
  }

  clearAll(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser && confirm('Are you sure you want to clear all notifications?')) {
      this.notificationService.clearAllNotifications(currentUser.id);
      this.updateUnreadCount(currentUser.id);
    }
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

  formatTime(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-center')) {
      this.showPanel = false;
    }
  }

  private updateUnreadCount(userId?: string): void {
    const currentUser = userId || this.userService.getCurrentUser()?.id;
    if (currentUser) {
      this.unreadCount = this.notificationService.getUnreadCount(currentUser);
    }
  }
}

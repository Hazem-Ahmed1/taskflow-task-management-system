import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationType } from '../models';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor(private db: DatabaseService) {}

  loadNotificationsForUser(userId: string): void {
    const notifs: Notification[] = this.db.getNotificationsByUser(userId).map(n => ({
      id: n['id'] as string,
      userId: n['userId'] as string,
      type: n['type'] as NotificationType,
      title: n['title'] as string,
      message: n['message'] as string,
      relatedEntityId: n['relatedEntityId'] as string,
      isRead: n['isRead'] as boolean,
      createdAt: new Date(n['createdAt'] as string)
    }));
    this.notificationsSubject.next(notifs);
  }

  getNotifications(userId: string): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(userId: string): number {
    return this.notificationsSubject.value.filter(n => n.userId === userId && !n.isRead).length;
  }

  createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedEntityId: string
  ): void {
    const notification: Notification = {
      id: this.db.generateId('notif'),
      userId,
      type,
      title,
      message,
      relatedEntityId,
      isRead: false,
      createdAt: new Date()
    };
    this.db.createNotification(notification);
    this.notificationsSubject.next([notification, ...this.notificationsSubject.value]);
  }

  markAsRead(notificationId: string): void {
    this.db.updateNotification(notificationId, { isRead: true });
    const updated = this.notificationsSubject.value.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(updated);
  }

  markAllAsRead(userId: string): void {
    this.db.markAllNotificationsRead(userId);
    const updated = this.notificationsSubject.value.map(n =>
      n.userId === userId ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(updated);
  }

  deleteNotification(notificationId: string): void {
    this.db.deleteNotification(notificationId);
    this.notificationsSubject.next(
      this.notificationsSubject.value.filter(n => n.id !== notificationId)
    );
  }

  clearAllNotifications(userId: string): void {
    this.notificationsSubject.value
      .filter(n => n.userId === userId)
      .forEach(n => this.db.deleteNotification(n.id));
    this.notificationsSubject.next(
      this.notificationsSubject.value.filter(n => n.userId !== userId)
    );
  }

  notifyCardAssignment(userId: string, cardTitle: string, cardId: string): void {
    this.createNotification(userId, NotificationType.CARD_ASSIGNED, 'New Card Assignment',
      `You have been assigned to "${cardTitle}"`, cardId);
  }

  notifyCardUpdate(userId: string, cardTitle: string, cardId: string): void {
    this.createNotification(userId, NotificationType.CARD_UPDATED, 'Card Updated',
      `"${cardTitle}" has been updated`, cardId);
  }

  notifyDeadlineApproaching(userId: string, cardTitle: string, cardId: string, days: number): void {
    this.createNotification(userId, NotificationType.DEADLINE_APPROACHING, 'Deadline Approaching',
      `"${cardTitle}" is due in ${days} day(s)`, cardId);
  }

  notifyBoardInvitation(userId: string, boardTitle: string, boardId: string): void {
    this.createNotification(userId, NotificationType.BOARD_INVITATION, 'Board Invitation',
      `You have been invited to "${boardTitle}"`, boardId);
  }
}

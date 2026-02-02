import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationType } from '../models';

/**
 * NotificationService - Manages application notifications
 * 
 * Architecture:
 * - Handles notification creation and management
 * - Provides real-time notification updates
 * - Supports different notification types
 * - Manages read/unread states
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() {}

  /**
   * Get all notifications for a user
   */
  getNotifications(userId: string): Observable<Notification[]> {
    return this.notifications$;
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(userId: string): number {
    return this.notificationsSubject.value
      .filter(n => n.userId === userId && !n.isRead)
      .length;
  }

  /**
   * Create new notification
   */
  createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedEntityId: string
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      userId,
      type,
      title,
      message,
      relatedEntityId,
      isRead: false,
      createdAt: new Date()
    };

    const notifications = [notification, ...this.notificationsSubject.value];
    this.notificationsSubject.next(notifications);
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(notifications);
  }

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): void {
    const notifications = this.notificationsSubject.value.map(n =>
      n.userId === userId ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(notifications);
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value.filter(
      n => n.id !== notificationId
    );
    this.notificationsSubject.next(notifications);
  }

  /**
   * Clear all notifications for a user
   */
  clearAllNotifications(userId: string): void {
    const notifications = this.notificationsSubject.value.filter(
      n => n.userId !== userId
    );
    this.notificationsSubject.next(notifications);
  }

  /**
   * Notify card assignment
   */
  notifyCardAssignment(userId: string, cardTitle: string, cardId: string): void {
    this.createNotification(
      userId,
      NotificationType.CARD_ASSIGNED,
      'New Card Assignment',
      `You have been assigned to "${cardTitle}"`,
      cardId
    );
  }

  /**
   * Notify card update
   */
  notifyCardUpdate(userId: string, cardTitle: string, cardId: string): void {
    this.createNotification(
      userId,
      NotificationType.CARD_UPDATED,
      'Card Updated',
      `"${cardTitle}" has been updated`,
      cardId
    );
  }

  /**
   * Notify deadline approaching
   */
  notifyDeadlineApproaching(userId: string, cardTitle: string, cardId: string, daysRemaining: number): void {
    this.createNotification(
      userId,
      NotificationType.DEADLINE_APPROACHING,
      'Deadline Approaching',
      `"${cardTitle}" is due in ${daysRemaining} day(s)`,
      cardId
    );
  }

  /**
   * Notify board invitation
   */
  notifyBoardInvitation(userId: string, boardTitle: string, boardId: string): void {
    this.createNotification(
      userId,
      NotificationType.BOARD_INVITATION,
      'Board Invitation',
      `You have been invited to "${boardTitle}"`,
      boardId
    );
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

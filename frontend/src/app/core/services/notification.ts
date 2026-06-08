import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Notification } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);

  notifications = signal<Notification[]>([]);
  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  loadNotifications() {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications`).pipe(
      tap(notifs => this.notifications.set(notifs))
    );
  }

  markAsRead(notificationId: string) {
    return this.http.put(`${environment.apiUrl}/notifications/${notificationId}/read`, {}).pipe(
      tap(() => {
        this.notifications.update(ns =>
          ns.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
      })
    );
  }

  markAllAsRead() {
    return this.http.put(`${environment.apiUrl}/notifications/read-all`, {}).pipe(
      tap(() => {
        this.notifications.update(ns => ns.map(n => ({ ...n, isRead: true })));
      })
    );
  }
}

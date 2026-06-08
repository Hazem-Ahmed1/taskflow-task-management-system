import { Component, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth';
import { BoardService } from '@core/services/board';
import { NotificationService } from '@core/services/notification';
import { NotificationCenterComponent } from './features/notifications/notification-center/notification-center.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationCenterComponent, AvatarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected auth = inject(AuthService);
  private boardService = inject(BoardService);
  private notificationService = inject(NotificationService);

  currentUser = this.auth.currentUser;
  showUserMenu = false;

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.boardService.loadBoards().subscribe();
        this.notificationService.loadNotifications().subscribe();
      }
    });
  }

  logout(): void {
    this.showUserMenu = false;
    this.auth.logout();
  }
}

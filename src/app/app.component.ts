import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '@core/models';
import { AuthService } from '@core/services/auth.service';
import { BoardService } from '@core/services/board.service';
import { NotificationService } from '@core/services/notification.service';
import { NotificationCenterComponent } from './features/notifications/notification-center/notification-center.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NotificationCenterComponent,
    AvatarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showUserMenu = false;

  private sub = new Subscription();

  constructor(
    private auth: AuthService,
    private boardService: BoardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.auth.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.boardService.loadBoardsForUser(user.id);
          this.notificationService.loadNotificationsForUser(user.id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  logout(): void {
    this.showUserMenu = false;
    this.auth.logout();
  }
}

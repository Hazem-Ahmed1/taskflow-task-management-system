import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '@core/services';
import { NotificationCenterComponent } from './features/notifications/notification-center/notification-center.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';

/**
 * AppComponent - Root application component
 * 
 * Architecture:
 * - Main layout with header and navigation
 * - Router outlet for feature modules
 * - Global user context
 */
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
export class AppComponent {
  currentUser = this.userService.getCurrentUser();

  constructor(private userService: UserService) {}
}

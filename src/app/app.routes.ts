import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { BoardListComponent } from './features/boards/board-list/board-list.component';
import { BoardDetailComponent } from './features/boards/board-detail/board-detail.component';
import { BoardContentComponent } from './features/boards/board-content/board-content.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ActivityLogComponent } from './features/activity/activity-log.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: 'TaskFlow | Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard],
    title: 'TaskFlow | Login'
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard],
    title: 'TaskFlow | Register'
  },
  {
    path: 'boards',
    component: BoardListComponent,
    canActivate: [authGuard],
    title: 'TaskFlow | Boards'
  },
  {
    path: 'boards/:id',
    component: BoardDetailComponent,
    canActivate: [authGuard],
    title: 'TaskFlow | Board Details',
    children: [
      {
        path: '',
        component: BoardContentComponent,
        title: 'TaskFlow | Board Content'
      }
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'TaskFlow | Profile'
  },
  {
    path: 'activity',
    component: ActivityLogComponent,
    canActivate: [authGuard],
    title: 'TaskFlow | Activity Log'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'TaskFlow | 404'
  }
];

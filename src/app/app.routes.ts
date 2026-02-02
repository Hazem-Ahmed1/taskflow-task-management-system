import { Routes } from '@angular/router';
import { BoardListComponent } from './features/boards/board-list/board-list.component';
import { BoardDetailComponent } from './features/boards/board-detail/board-detail.component';
import { BoardContentComponent } from './features/boards/board-content/board-content.component';

/**
 * Application Routes
 * 
 * Architecture:
 * - Lazy loading for feature modules
 * - Clear route hierarchy
 * - Board detail with nested content routes
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/boards',
    pathMatch: 'full'
  },
  {
    path: 'boards',
    component: BoardListComponent
  },
  {
    path: 'boards/:id',
    component: BoardDetailComponent,
    children: [
      {
        path: '',
        component: BoardContentComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/boards'
  }
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Board } from '@core/models';
import { BoardService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { SharedModule } from '@shared/shared.module';

/**
 * BoardListComponent - Displays all user boards
 * 
 * Architecture:
 * - Presentation component for board listing
 * - Uses BoardService for data management
 * - Supports board creation and navigation
 */
@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {
  boards$!: Observable<Board[]>;
  showCreateModal = false;
  newBoard = {
    title: '',
    description: '',
    backgroundColor: '#0079bf'
  };
  errors = {
    title: ''
  };

  colorOptions = [
    '#4f46e5', '#0891b2', '#059669', '#d97706',
    '#dc2626', '#7c3aed', '#db2777', '#0369a1'
  ];

  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.boards$ = this.boardService.getBoards();
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.resetForm();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  createBoard(event: Event): void {
    event.preventDefault();
    
    // Validation
    if (!this.newBoard.title.trim()) {
      this.errors.title = 'Board title is required';
      return;
    }

    const currentUser = this.authService.currentUser;
    const userId = currentUser?.id ?? 'guest';

    const board = this.boardService.createBoard({
      title: this.newBoard.title,
      description: this.newBoard.description,
      backgroundColor: this.newBoard.backgroundColor,
      ownerId: userId,
      members: [userId],
      lists: [],
      isStarred: false
    });

    this.closeCreateModal();
    this.openBoard(board.id);
  }

  toggleStar(event: Event, boardId: string): void {
    event.stopPropagation();
    this.boardService.toggleStar(boardId);
  }

  private resetForm(): void {
    this.newBoard = {
      title: '',
      description: '',
      backgroundColor: '#0079bf'
    };
    this.errors = {
      title: ''
    };
  }
}

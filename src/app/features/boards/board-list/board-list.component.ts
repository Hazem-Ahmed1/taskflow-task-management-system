import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Board } from '@core/models';
import { BoardService } from '@core/services';
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
    '#0079bf', '#d29034', '#519839', '#b04632',
    '#89609e', '#cd5a91', '#4bbf6b', '#00aecc'
  ];

  constructor(
    private boardService: BoardService,
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

    // Create board
    const board = this.boardService.createBoard({
      title: this.newBoard.title,
      description: this.newBoard.description,
      backgroundColor: this.newBoard.backgroundColor,
      ownerId: 'user_1', // TODO: Get from auth service
      members: ['user_1'],
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

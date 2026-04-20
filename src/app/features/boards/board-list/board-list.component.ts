import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Board, User } from '@core/models';
import { BoardService, UserService, NotificationService } from '@core/services';
import { AuthService } from '@core/services/auth';
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
export class BoardListComponent implements OnInit, OnDestroy {
  boards$!: Observable<Board[]>;
  users: User[] = [];
  selectedMemberIds: string[] = [];
  showCreateModal = false;
  newBoard = {
    title: '',
    description: '',
    backgroundColor: '#0079bf'
  };
  errors = {
    title: ''
  };
  private destroy$ = new Subject<void>();

  colorOptions = [
    '#4f46e5', '#0891b2', '#059669', '#d97706',
    '#dc2626', '#7c3aed', '#db2777', '#0369a1'
  ];

  constructor(
    private boardService: BoardService,
    private userService: UserService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.boards$ = this.boardService.getBoards();

    // Always refresh boards for the active account when this page opens.
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.boardService.loadBoardsForUser(currentUser.id);
    }

    // If account changes (logout/login), reload boards for new user.
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.boardService.loadBoardsForUser(user.id);
        }
      });

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    if (!currentUser) return;
    const userId = currentUser.id;
    const memberIds = Array.from(new Set([userId, ...this.selectedMemberIds]));

    const board = this.boardService.createBoard({
      title: this.newBoard.title,
      description: this.newBoard.description,
      backgroundColor: this.newBoard.backgroundColor,
      ownerId: userId,
      members: memberIds,
      lists: [],
      isStarred: false
    });

    // Notify invited users (exclude owner)
    memberIds
      .filter(id => id !== userId)
      .forEach(id => {
        this.notificationService.notifyBoardInvitation(id, board.title, board.id);
      });

    this.closeCreateModal();
    this.openBoard(board.id);
  }

  toggleStar(event: Event, boardId: string): void {
    event.stopPropagation();
    this.boardService.toggleStar(boardId);
  }

  toggleMemberSelection(userId: string): void {
    const currentUserId = this.authService.currentUser?.id;
    if (userId === currentUserId) return;
    this.selectedMemberIds = this.selectedMemberIds.includes(userId)
      ? this.selectedMemberIds.filter(id => id !== userId)
      : [...this.selectedMemberIds, userId];
  }

  isMemberSelected(userId: string): boolean {
    return this.selectedMemberIds.includes(userId);
  }

  get selectableUsers(): User[] {
    const currentUserId = this.authService.currentUser?.id;
    return this.users.filter(user => user.id !== currentUserId);
  }

  private resetForm(): void {
    this.newBoard = {
      title: '',
      description: '',
      backgroundColor: '#0079bf'
    };
    this.selectedMemberIds = [];
    this.errors = {
      title: ''
    };
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Board, User } from '@core/models';
import { BoardService, UserService } from '@core/services';
import { AuthService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { BoardContentComponent } from '../board-content/board-content.component';

/**
 * BoardDetailComponent - Main board view with lists and cards
 * 
 * Architecture:
 * - Container component for board operations
 * - Manages board state and child components
 * - Handles board settings and member management
 */
@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, BoardContentComponent],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  board: Board | null = null;
  showSettingsModal = false;
  showMemberModal = false;
  editBoard = { title: '', description: '' };
  memberSearchQuery = '';
  filteredUsers: User[] = [];
  allUsers: User[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  get isOwner(): boolean {
    return !!this.board && this.board.ownerId === this.authService.currentUser?.id;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const boardId = params['id'];
        this.loadBoard(boardId);
      });

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.allUsers = users;
        this.filteredUsers = users;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBoard(boardId: string): void {
    const board = this.boardService.getBoardById(boardId);
    if (board) {
      this.board = board;
      this.editBoard = {
        title: board.title,
        description: board.description
      };
      this.boardService.selectBoard(board);
    }
  }

  toggleStar(): void {
    if (this.board) {
      this.boardService.toggleStar(this.board.id);
      this.loadBoard(this.board.id);
    }
  }

  saveSettings(): void {
    if (this.board) {
      this.boardService.updateBoard(this.board.id, {
        title: this.editBoard.title,
        description: this.editBoard.description
      });
      this.loadBoard(this.board.id);
      this.showSettingsModal = false;
    }
  }

  deleteBoard(): void {
    if (this.board && confirm('Are you sure you want to delete this board?')) {
      this.boardService.deleteBoard(this.board.id);
      this.router.navigate(['/boards']);
    }
  }

  searchMembers(): void {
    if (!this.memberSearchQuery.trim()) {
      this.filteredUsers = this.allUsers;
    } else {
      this.filteredUsers = this.userService.searchUsers(this.memberSearchQuery);
    }
  }

  addMember(userId: string): void {
    if (this.board && !this.isMember(userId)) {
      this.boardService.addMember(this.board.id, userId);
      this.loadBoard(this.board.id);
    }
  }

  isMember(userId: string): boolean {
    return this.board?.members.includes(userId) || false;
  }

  getUserById(userId: string): User | undefined {
    return this.userService.getUserById(userId);
  }

  goBack(): void {
    this.router.navigate(['/boards']);
  }
}

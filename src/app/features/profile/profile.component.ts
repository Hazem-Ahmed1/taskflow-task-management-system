import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '@core/services/auth';
import { BoardService, UserService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { Board, User } from '@core/models';

interface BoardPreview {
  board: Board;
  ownerName?: string;    // only set for invited boards
  ownerAvatar?: string;
  taskCount: number;
  completedCount: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  ownedBoards: BoardPreview[] = [];
  invitedBoards: BoardPreview[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private boardService: BoardService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if (!this.currentUser) { this.router.navigate(['/login']); return; }

    const uid = this.currentUser.id;
    this.boardService.loadBoardsForUser(uid);

    this.boardService.getBoards()
      .pipe(takeUntil(this.destroy$))
      .subscribe(allBoards => {
        this.ownedBoards = allBoards
          .filter(b => b.ownerId === uid)
          .map(b => this.toPreview(b));

        this.invitedBoards = allBoards
          .filter(b => b.ownerId !== uid && b.members.includes(uid))
          .map(b => {
            const owner = this.userService.getUserById(b.ownerId);
            return { ...this.toPreview(b), ownerName: owner?.name, ownerAvatar: owner?.avatar };
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private toPreview(board: Board): BoardPreview {
    let taskCount = 0;
    let completedCount = 0;
    for (const list of board.lists) {
      for (const card of list.cards) {
        taskCount++;
        if ((card as any).isCompleted) completedCount++;
      }
    }
    return { board, taskCount, completedCount };
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  toggleStar(event: Event, boardId: string): void {
    event.stopPropagation();
    this.boardService.toggleStar(boardId);
  }

  get totalTasks(): number {
    return [...this.ownedBoards, ...this.invitedBoards]
      .reduce((s, p) => s + p.taskCount, 0);
  }

  get completedTasks(): number {
    return [...this.ownedBoards, ...this.invitedBoards]
      .reduce((s, p) => s + p.completedCount, 0);
  }

}

import { Component, inject, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';
import { BoardService, UserService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { BoardSummary } from '@core/models/board.model';

interface BoardPreview {
  board: BoardSummary;
  ownerName?: string;
  ownerAvatar?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SharedModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private boardService = inject(BoardService);
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  ownedBoards = computed<BoardPreview[]>(() => {
    const uid = this.currentUser()?.id;
    if (!uid) return [];
    return this.boardService.boards()
      .filter(b => b.ownerId === uid)
      .map(b => ({ board: b }));
  });

  invitedBoards = computed<BoardPreview[]>(() => {
    const uid = this.currentUser()?.id;
    if (!uid) return [];
    return this.boardService.boards()
      .filter(b => b.ownerId !== uid && b.memberIds.includes(uid))
      .map(b => {
        const owner = this.userService.getUserById(b.ownerId);
        return { board: b, ownerName: owner?.name, ownerAvatar: owner?.avatar ?? undefined };
      });
  });

  totalCards = computed(() =>
    [...this.ownedBoards(), ...this.invitedBoards()].reduce((s, p) => s + p.board.cardCount, 0)
  );

  ngOnInit(): void {
    if (!this.currentUser()) { this.router.navigate(['/login']); return; }
    this.boardService.loadBoards().subscribe();
    this.userService.loadAll().subscribe();
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  toggleStar(event: Event, boardId: string): void {
    event.stopPropagation();
    this.boardService.toggleStar(boardId).subscribe();
  }
}

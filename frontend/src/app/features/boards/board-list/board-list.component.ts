import { Component, signal, inject, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@core/models';
import { BoardService, UserService } from '@core/services';
import { AuthService } from '@core/services/auth';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-board-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {
  protected boardService = inject(BoardService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  boards = this.boardService.boards;
  starredBoards = this.boardService.starredBoards;
  loading = this.boardService.loading;
  users = this.userService.users;

  showCreateModal = signal(false);
  selectedMemberIds = signal<string[]>([]);
  newBoardTitle = signal('');
  newBoardDescription = signal('');
  newBoardColor = signal('#0079bf');
  titleError = signal('');

  readonly colorOptions = [
    '#4f46e5', '#0891b2', '#059669', '#d97706',
    '#dc2626', '#7c3aed', '#db2777', '#0369a1'
  ];

  selectableUsers = computed(() => {
    const currentId = this.authService.currentUser()?.id;
    return this.users().filter(u => u.id !== currentId);
  });

  ngOnInit(): void {
    this.boardService.loadBoards().subscribe();
    this.userService.loadAll().subscribe();
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
    this.resetForm();
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.resetForm();
  }

  createBoard(event: Event): void {
    event.preventDefault();
    if (!this.newBoardTitle().trim()) {
      this.titleError.set('Board title is required');
      return;
    }

    this.boardService.createBoard({
      title: this.newBoardTitle().trim(),
      description: this.newBoardDescription().trim(),
      backgroundColor: this.newBoardColor()
    }).subscribe({
      next: (board) => {
        this.closeCreateModal();
        this.router.navigate(['/boards', board.id]);
      },
      error: () => this.titleError.set('Failed to create board. Please try again.')
    });
  }

  toggleStar(event: Event, boardId: string): void {
    event.stopPropagation();
    this.boardService.toggleStar(boardId).subscribe();
  }

  toggleMemberSelection(userId: string): void {
    const current = this.selectedMemberIds();
    this.selectedMemberIds.set(
      current.includes(userId) ? current.filter(id => id !== userId) : [...current, userId]
    );
  }

  isMemberSelected(userId: string): boolean {
    return this.selectedMemberIds().includes(userId);
  }

  private resetForm(): void {
    this.newBoardTitle.set('');
    this.newBoardDescription.set('');
    this.newBoardColor.set('#0079bf');
    this.selectedMemberIds.set([]);
    this.titleError.set('');
  }
}

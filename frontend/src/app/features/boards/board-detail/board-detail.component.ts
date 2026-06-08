import { Component, signal, inject, computed, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '@core/models';
import { BoardService, UserService } from '@core/services';
import { AuthService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { BoardContentComponent } from '../board-content/board-content.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SharedModule, BoardContentComponent],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected boardService = inject(BoardService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  board = this.boardService.selectedBoard;
  users = this.userService.users;

  showSettingsModal = signal(false);
  showMemberModal = signal(false);
  editTitle = signal('');
  editDescription = signal('');
  editBackgroundColor = signal('');
  memberSearchQuery = signal('');

  readonly boardColors = [
    '#0052cc', '#00875a', '#ff5630', '#ff8b00',
    '#6554c0', '#00b8d9', '#36b37e', '#ff991f',
    '#403294', '#172b4d', '#091e42', '#42526e',
  ];

  isOwner = computed(() => {
    const b = this.board();
    return !!b && b.ownerId === this.authService.currentUser()?.id;
  });

  filteredUsers = computed(() => {
    const q = this.memberSearchQuery().toLowerCase();
    return q
      ? this.users().filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      : this.users();
  });

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userService.loadAll().subscribe();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const boardId = params['id'] as string;
      this.boardService.loadBoardById(boardId).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSettings(): void {
    const b = this.board();
    if (b) {
      this.editTitle.set(b.title);
      this.editDescription.set(b.description);
      this.editBackgroundColor.set(b.backgroundColor);
      this.showSettingsModal.set(true);
    }
  }

  saveSettings(): void {
    const b = this.board();
    if (!b) return;
    this.boardService.updateBoard(b.id, {
      title: this.editTitle(),
      description: this.editDescription(),
      backgroundColor: this.editBackgroundColor()
    }).subscribe(() => this.showSettingsModal.set(false));
  }

  deleteBoard(): void {
    const b = this.board();
    if (!b || !confirm('Are you sure you want to delete this board?')) return;
    this.boardService.deleteBoard(b.id).subscribe(() => this.router.navigate(['/boards']));
  }

  toggleStar(): void {
    const b = this.board();
    if (b) this.boardService.toggleStar(b.id).subscribe();
  }

  addMember(userId: string): void {
    const b = this.board();
    if (!b || this.isMember(userId)) return;
    this.boardService.addMember(b.id, userId).subscribe(() => {
      this.boardService.loadBoardById(b.id).subscribe();
    });
  }

  removeMember(userId: string): void {
    const b = this.board();
    if (!b) return;
    this.boardService.removeMember(b.id, userId).subscribe(() => {
      this.boardService.loadBoardById(b.id).subscribe();
    });
  }

  isMember(userId: string): boolean {
    return this.board()?.members.some(m => m.id === userId) ?? false;
  }

  goBack(): void {
    this.router.navigate(['/boards']);
  }
}

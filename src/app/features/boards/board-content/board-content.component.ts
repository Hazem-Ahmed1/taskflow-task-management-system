import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { Board, List, Card } from '@core/models';
import { BoardService, ListService, CardNavigationService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { ListItemComponent } from '../../lists/list-item/list-item.component';
import { CardDetailComponent } from '../../cards/card-detail/card-detail.component';

@Component({
  selector: 'app-board-content',
  standalone: true,
  imports: [CommonModule, SharedModule, DragDropModule, ListItemComponent, CardDetailComponent],
  templateUrl: './board-content.component.html',
  styleUrls: ['./board-content.component.scss']
})
export class BoardContentComponent implements OnInit, OnDestroy {
  board: Board | null = null;

  showAddList = false;
  newListTitle = '';

  selectedCard: Card | null = null;
  showCardDetail = false;

  private destroy$ = new Subject<void>();

  constructor(
    private boardService: BoardService,
    private listService: ListService,
    private cardNav: CardNavigationService
  ) {}

  ngOnInit(): void {
    this.boardService.selectedBoard$
      .pipe(takeUntil(this.destroy$))
      .subscribe(board => {
        this.board = board;

        // If notification navigation set a pending card, open it now
        if (board) {
          const pendingCardId = this.cardNav.consumePendingCard();
          if (pendingCardId) {
            this.tryOpenCardById(pendingCardId);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Card Detail ─────────────────────────────────────────────────────────

  openCard(card: Card): void {
    this.selectedCard = card;
    this.showCardDetail = true;
  }

  private tryOpenCardById(cardId: string): void {
    if (!this.board) return;
    for (const list of this.board.lists) {
      const card = list.cards.find(c => c.id === cardId);
      if (card) {
        this.openCard(card);
        return;
      }
    }
  }

  // ─── List Drag & Drop ────────────────────────────────────────────────────

  onListDrop(event: CdkDragDrop<List[]>): void {
    if (!this.board) return;
    const lists = [...this.board.lists];
    moveItemInArray(lists, event.previousIndex, event.currentIndex);
    this.listService.reorderLists(this.board.id, lists);
    const updatedBoard = this.boardService.getBoardById(this.board.id);
    if (updatedBoard) this.board = updatedBoard;
  }

  // ─── List CRUD ───────────────────────────────────────────────────────────

  createList(): void {
    if (!this.board || !this.newListTitle.trim()) return;
    this.listService.createList(this.board.id, this.newListTitle);
    this.newListTitle = '';
    this.showAddList = false;
    const updatedBoard = this.boardService.getBoardById(this.board.id);
    if (updatedBoard) this.board = updatedBoard;
  }

  cancelAddList(): void {
    this.showAddList = false;
    this.newListTitle = '';
  }

  deleteList(listId: string): void {
    if (!this.board) return;
    if (confirm('Are you sure you want to delete this list and all its cards?')) {
      this.listService.deleteList(this.board.id, listId);
      const updatedBoard = this.boardService.getBoardById(this.board.id);
      if (updatedBoard) this.board = updatedBoard;
    }
  }
}

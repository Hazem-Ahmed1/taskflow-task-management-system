import { Component, signal, inject, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { Card, List } from '@core/models';
import { BoardService, ListService, CardNavigationService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { ListItemComponent } from '../../lists/list-item/list-item.component';
import { CardDetailComponent } from '../../cards/card-detail/card-detail.component';

@Component({
  selector: 'app-board-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SharedModule, DragDropModule, ListItemComponent, CardDetailComponent],
  templateUrl: './board-content.component.html',
  styleUrls: ['./board-content.component.scss']
})
export class BoardContentComponent implements OnInit, OnDestroy {
  protected boardService = inject(BoardService);
  private listService = inject(ListService);
  private cardNav = inject(CardNavigationService);

  board = this.boardService.selectedBoard;

  showAddList = signal(false);
  newListTitle = signal('');
  selectedCard = signal<Card | null>(null);
  showCardDetail = signal(false);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Watch for board loads triggered by navigation; open pending card from notification
    const interval = setInterval(() => {
      const b = this.board();
      if (b) {
        const pendingCardId = this.cardNav.consumePendingCard();
        if (pendingCardId) this.tryOpenCardById(pendingCardId);
        clearInterval(interval);
      }
    }, 100);
    setTimeout(() => clearInterval(interval), 5000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCard(card: Card): void {
    this.selectedCard.set(card);
    this.showCardDetail.set(true);
  }

  private tryOpenCardById(cardId: string): void {
    const board = this.board();
    if (!board) return;
    for (const list of board.lists) {
      const card = list.cards.find(c => c.id === cardId);
      if (card) { this.openCard(card); return; }
    }
  }

  onListDrop(event: CdkDragDrop<List[]>): void {
    const board = this.board();
    if (!board) return;
    const lists = [...board.lists];
    moveItemInArray(lists, event.previousIndex, event.currentIndex);
    this.listService.reorderLists(board.id, lists.map(l => l.id)).subscribe();
  }

  createList(): void {
    const board = this.board();
    if (!board || !this.newListTitle().trim()) return;
    this.listService.createList(board.id, this.newListTitle()).subscribe(() => {
      this.newListTitle.set('');
      this.showAddList.set(false);
    });
  }

  cancelAddList(): void {
    this.showAddList.set(false);
    this.newListTitle.set('');
  }

  deleteList(listId: string): void {
    if (!confirm('Are you sure you want to delete this list and all its cards?')) return;
    this.listService.deleteList(listId).subscribe();
  }
}

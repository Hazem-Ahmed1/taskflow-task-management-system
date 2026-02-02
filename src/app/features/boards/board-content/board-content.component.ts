import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { Board, List } from '@core/models';
import { BoardService, ListService, CardService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { ListItemComponent } from '../../lists/list-item/list-item.component';

/**
 * BoardContentComponent - Manages lists and drag-drop
 * 
 * Architecture:
 * - Uses Angular CDK DragDrop for list reordering
 * - Manages list creation and deletion
 * - Coordinates with ListService and CardService
 */
@Component({
  selector: 'app-board-content',
  standalone: true,
  imports: [CommonModule, SharedModule, DragDropModule, ListItemComponent],
  templateUrl: './board-content.component.html',
  styleUrls: ['./board-content.component.scss']
})
export class BoardContentComponent implements OnInit, OnDestroy {
  board: Board | null = null;
  showAddList = false;
  newListTitle = '';

  private destroy$ = new Subject<void>();

  constructor(
    private boardService: BoardService,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.boardService.selectedBoard$
      .pipe(takeUntil(this.destroy$))
      .subscribe(board => {
        this.board = board;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onListDrop(event: CdkDragDrop<List[]>): void {
    if (!this.board) return;

    const lists = [...this.board.lists];
    moveItemInArray(lists, event.previousIndex, event.currentIndex);
    this.listService.reorderLists(this.board.id, lists);
    
    // Reload board
    const updatedBoard = this.boardService.getBoardById(this.board.id);
    if (updatedBoard) {
      this.board = updatedBoard;
    }
  }

  createList(): void {
    if (!this.board || !this.newListTitle.trim()) return;

    this.listService.createList(this.board.id, this.newListTitle);
    this.newListTitle = '';
    this.showAddList = false;

    // Reload board
    const updatedBoard = this.boardService.getBoardById(this.board.id);
    if (updatedBoard) {
      this.board = updatedBoard;
    }
  }

  cancelAddList(): void {
    this.showAddList = false;
    this.newListTitle = '';
  }

  deleteList(listId: string): void {
    if (!this.board) return;

    if (confirm('Are you sure you want to delete this list and all its cards?')) {
      this.listService.deleteList(this.board.id, listId);
      
      // Reload board
      const updatedBoard = this.boardService.getBoardById(this.board.id);
      if (updatedBoard) {
        this.board = updatedBoard;
      }
    }
  }
}

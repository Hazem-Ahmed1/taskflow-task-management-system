import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { List, Card, Priority } from '@core/models';
import { ListService, CardService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { CardItemComponent } from '../../cards/card-item/card-item.component';

/**
 * ListItemComponent - Individual list with cards
 * 
 * Architecture:
 * - Manages cards within a list
 * - Supports card drag & drop
 * - Handles card creation and list editing
 */
@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, SharedModule, DragDropModule, CardItemComponent],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() list!: List;
  @Input() boardId!: string;
  @Output() deleted = new EventEmitter<void>();

  isEditing = false;
  editTitle = '';
  showMenu = false;
  showAddCard = false;
  newCardTitle = '';

  constructor(
    private listService: ListService,
    private cardService: CardService
  ) {}

  startEdit(): void {
    this.isEditing = true;
    this.editTitle = this.list.title;
    setTimeout(() => {
      const input = document.querySelector('.list-title-input') as HTMLInputElement;
      input?.focus();
      input?.select();
    });
  }

  saveTitle(): void {
    if (this.editTitle.trim() && this.editTitle !== this.list.title) {
      this.listService.updateList(this.boardId, this.list.id, {
        title: this.editTitle
      });
    }
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editTitle = this.list.title;
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  deleteList(): void {
    this.deleted.emit();
    this.showMenu = false;
  }

  createCard(): void {
    if (!this.newCardTitle.trim()) return;

    this.cardService.createCard(this.boardId, this.list.id, {
      title: this.newCardTitle,
      description: '',
      assignedUsers: [],
      priority: Priority.MEDIUM,
      labels: [],
      comments: [],
      attachments: []
    });

    this.newCardTitle = '';
    this.showAddCard = false;
  }

  cancelAddCard(): void {
    this.showAddCard = false;
    this.newCardTitle = '';
  }

  onCardDrop(event: CdkDragDrop<Card[]>): void {
    if (event.previousContainer === event.container) {
      // Reorder within same list
      const cards = [...this.list.cards];
      moveItemInArray(cards, event.previousIndex, event.currentIndex);
      this.cardService.reorderCards(this.boardId, this.list.id, cards);
    } else {
      // Move to different list
      const card = event.previousContainer.data[event.previousIndex];
      const sourceListId = card.listId;
      
      this.cardService.moveCard(
        this.boardId,
        sourceListId,
        this.list.id,
        card.id,
        event.currentIndex
      );
    }
  }

  getConnectedLists(): string[] {
    // Return IDs of all list drop containers for drag & drop connection
    // This will be populated by the parent component
    return [];
  }

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.list-menu') && !target.closest('.list-menu-btn')) {
      this.showMenu = false;
    }
  }
}

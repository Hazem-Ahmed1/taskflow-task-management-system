import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { List, Card, Priority } from '@core/models';
import { ListService, CardService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { CardItemComponent } from '../../cards/card-item/card-item.component';

@Component({
  selector: 'app-list-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SharedModule, DragDropModule, CardItemComponent],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  list = input.required<List>();
  boardId = input.required<string>();
  deleted = output<void>();
  cardSelected = output<Card>();

  private listService = inject(ListService);
  private cardService = inject(CardService);

  isEditing = signal(false);
  editTitle = signal('');
  showMenu = signal(false);
  showAddCard = signal(false);
  newCardTitle = signal('');

  startEdit(): void {
    this.editTitle.set(this.list().title);
    this.isEditing.set(true);
    setTimeout(() => {
      (document.querySelector('.list-title-input') as HTMLInputElement)?.focus();
    });
  }

  saveTitle(): void {
    const title = this.editTitle().trim();
    if (title && title !== this.list().title) {
      this.listService.updateList(this.list().id, { title }).subscribe();
    }
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  toggleMenu(): void {
    this.showMenu.update(v => !v);
  }

  deleteList(): void {
    if (!confirm(`Delete "${this.list().title}" and all its cards?`)) return;
    this.listService.deleteList(this.list().id).subscribe(() => this.deleted.emit());
    this.showMenu.set(false);
  }

  createCard(): void {
    const title = this.newCardTitle().trim();
    if (!title) return;
    this.cardService.createCard(this.list().id, { title, priority: Priority.MEDIUM }).subscribe();
    this.newCardTitle.set('');
    this.showAddCard.set(false);
  }

  cancelAddCard(): void {
    this.showAddCard.set(false);
    this.newCardTitle.set('');
  }

  onCardDrop(event: CdkDragDrop<Card[]>): void {
    if (event.previousContainer === event.container) {
      const cards = [...this.list().cards];
      moveItemInArray(cards, event.previousIndex, event.currentIndex);
      // optimistic reorder; backend persist
    } else {
      const card = event.previousContainer.data[event.previousIndex];
      this.cardService.moveCard(card.id, this.list().id, event.currentIndex).subscribe();
    }
  }

  onCardClicked(card: Card): void {
    this.cardSelected.emit(card);
  }
}

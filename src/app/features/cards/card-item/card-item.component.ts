import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '@core/models';
import { UserService } from '@core/services';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent {
  @Input() card!: Card;
  @Input() boardId!: string;
  @Input() listId!: string;

  /** Emitted when the user clicks the card to open the detail view */
  @Output() cardClicked = new EventEmitter<Card>();

  constructor(private userService: UserService) {}

  openDetail(): void {
    this.cardClicked.emit(this.card);
  }

  getUserById(userId: string) {
    return this.userService.getUserById(userId);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays}d`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  isOverdue(): boolean {
    if (!this.card.deadline) return false;
    return new Date(this.card.deadline) < new Date();
  }

  getLabelColor(label: string): string {
    const colors: Record<string, string> = {
      bug: '#eb5a46',
      feature: '#61bd4f',
      enhancement: '#00c2e0',
      documentation: '#c377e0',
      urgent: '#ff9f1a',
      default: '#0079bf'
    };
    return colors[label.toLowerCase()] ?? colors['default'];
  }
}

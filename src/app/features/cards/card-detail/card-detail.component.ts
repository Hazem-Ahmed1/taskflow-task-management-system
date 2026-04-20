import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card, Priority, User } from '@core/models';
import { CardService, UserService, NotificationService, ActivityService } from '@core/services';
import { ActivityAction } from '@core/models';
import { SharedModule } from '@shared/shared.module';
import { DropdownOption } from '@shared/components/dropdown/dropdown.component';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnChanges {
  // ─── Inputs / Outputs ────────────────────────────────────────────────────

  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  @Input() card: Card | null = null;
  @Input() boardId!: string;
  @Input() listId!: string;

  // ─── State ───────────────────────────────────────────────────────────────

  isEditingDescription = false;
  editedDescription = '';
  showMemberPicker = false;

  showCompletionForm = false;
  completionNote = '';

  readonly priorityOptions: DropdownOption[] = [
    { value: Priority.LOW,    label: 'Low',    icon: '🟢' },
    { value: Priority.MEDIUM, label: 'Medium', icon: '🟡' },
    { value: Priority.HIGH,   label: 'High',   icon: '🟠' },
    { value: Priority.URGENT, label: 'Urgent', icon: '🔴' }
  ];

  constructor(
    private cardService: CardService,
    private userService: UserService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private activityService: ActivityService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['card'] || changes['isOpen']?.currentValue === false) {
      this.isEditingDescription = false;
      this.showMemberPicker = false;
      this.showCompletionForm = false;
      this.completionNote = '';
      this.editedDescription = this.card?.description || '';
    }
  }

  // ─── Computed ────────────────────────────────────────────────────────────

  get assignees(): User[] {
    if (!this.card) return [];
    return (this.card.assignedUsers || [])
      .map(id => this.userService.getUserById(id))
      .filter((u): u is User => !!u);
  }

  get availableUsers(): User[] {
    const assigned = this.card?.assignedUsers ?? [];
    return this.userService.searchUsers('').filter(u => !assigned.includes(u.id));
  }

  get isCompleted(): boolean {
    return !!(this.card as any)?.isCompleted;
  }

  // ─── Description ─────────────────────────────────────────────────────────

  startEditingDescription(): void {
    this.editedDescription = this.card?.description || '';
    this.isEditingDescription = true;
  }

  saveDescription(): void {
    if (!this.card) return;
    this.updateCardField('description', this.editedDescription);
    this.isEditingDescription = false;
  }

  cancelEditingDescription(): void {
    this.isEditingDescription = false;
    this.editedDescription = this.card?.description || '';
  }

  // ─── Field Updates ────────────────────────────────────────────────────────

  updateCardField(field: string, value: unknown): void {
    if (!this.card) return;
    this.cardService.updateCard(this.boardId, this.listId, this.card.id, {
      [field]: value
    } as Partial<Card>);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.card as any)[field] = value;
  }

  formatDateForInput(date: Date | null | undefined): string {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  updateDueDate(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.updateCardField('deadline', val ? new Date(val) : null);
  }

  // ─── Completion ───────────────────────────────────────────────────────────

  startComplete(): void {
    this.showCompletionForm = true;
    this.completionNote = '';
  }

  confirmComplete(): void {
    if (!this.card) return;
    this.updateCardField('isCompleted', true);
    this.updateCardField('completionNote', this.completionNote.trim());
    this.showCompletionForm = false;

    this.activityService.log(
      ActivityAction.CARD_COMPLETED,
      `Marked "${this.card.title}" as complete`,
      { boardId: this.boardId, cardId: this.card.id }
    );
  }

  cancelComplete(): void {
    this.showCompletionForm = false;
    this.completionNote = '';
  }

  undoComplete(): void {
    this.updateCardField('isCompleted', false);
    this.updateCardField('completionNote', '');
  }

  // ─── Members ─────────────────────────────────────────────────────────────

  openAddMemberModal(): void {
    this.userService.refresh();
    this.showMemberPicker = !this.showMemberPicker;
  }

  addMember(userId: string): void {
    if (!this.card) return;
    if ((this.card.assignedUsers || []).includes(userId)) return;

    this.cardService.assignUser(this.boardId, this.listId, this.card.id, userId);
    const assignedUsers = [...(this.card.assignedUsers || []), userId];
    this.card.assignedUsers = assignedUsers;
    this.showMemberPicker = false;

    // Only notify the assignee — skip if they assigned themselves
    const currentUserId = this.authService.currentUser?.id;
    if (userId !== currentUserId) {
      this.notificationService.notifyCardAssignment(userId, this.card.title, this.card.id);
    }

    const assigneeName = this.userService.getUserById(userId)?.name ?? userId;
    this.activityService.log(
      ActivityAction.MEMBER_ASSIGNED,
      `Assigned ${assigneeName} to "${this.card.title}"`,
      { boardId: this.boardId, cardId: this.card.id }
    );
  }

  removeMember(userId: string): void {
    if (!this.card) return;
    const assignedUsers = (this.card.assignedUsers || []).filter(id => id !== userId);
    this.updateCardField('assignedUsers', assignedUsers);
  }

  // ─── Labels ───────────────────────────────────────────────────────────────

  getLabelColor(label: string): string {
    const palette: Record<string, string> = {
      bug: '#eb5a46', feature: '#61bd4f', enhancement: '#00c2e0',
      documentation: '#c377e0', urgent: '#ff9f1a', design: '#f87171',
      backend: '#818cf8', frontend: '#34d399', devops: '#fb923c',
      api: '#60a5fa', auth: '#a78bfa', ui: '#f9a8d4', setup: '#86efac',
      review: '#fcd34d', meeting: '#6ee7b7', content: '#93c5fd',
      planning: '#c4b5fd', branding: '#fca5a5', social: '#a5f3fc',
      outreach: '#bbf7d0', learning: '#fde68a', angular: '#fca5a5',
      career: '#ddd6fe'
    };
    return palette[label.toLowerCase()] ?? '#94a3b8';
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  deleteCard(): void {
    if (!this.card) return;
    if (!confirm(`Delete "${this.card.title}"? This cannot be undone.`)) return;
    this.cardService.deleteCard(this.boardId, this.listId, this.card.id);
    this.close();
  }

  // ─── Modal ────────────────────────────────────────────────────────────────

  onModalChange(val: boolean): void {
    this.isOpen = val;
    this.isOpenChange.emit(val);
    if (!val) {
      this.isEditingDescription = false;
      this.showMemberPicker = false;
      this.showCompletionForm = false;
    }
  }

  close(): void {
    this.onModalChange(false);
  }
}

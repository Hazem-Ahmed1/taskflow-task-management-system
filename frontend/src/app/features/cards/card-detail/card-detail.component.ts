import { Component, input, output, signal, inject, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card, Priority, User } from '@core/models';
import { CardService, UserService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { DropdownOption } from '@shared/components/dropdown/dropdown.component';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent {
  isOpen = input(false);
  isOpenChange = output<boolean>();
  card = input<Card | null>(null);
  boardId = input('');
  listId = input('');

  protected cardService = inject(CardService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  isEditingDescription = signal(false);
  editedDescription = signal('');
  showMemberPicker = signal(false);
  showCompletionForm = signal(false);
  completionNote = signal('');

  readonly priorityOptions: DropdownOption[] = [
    { value: Priority.LOW,    label: 'Low',    icon: '🟢' },
    { value: Priority.MEDIUM, label: 'Medium', icon: '🟡' },
    { value: Priority.HIGH,   label: 'High',   icon: '🟠' },
    { value: Priority.URGENT, label: 'Urgent', icon: '🔴' }
  ];

  constructor() {
    effect(() => {
      const c = this.card();
      const open = this.isOpen();
      if (c || !open) {
        this.isEditingDescription.set(false);
        this.showMemberPicker.set(false);
        this.showCompletionForm.set(false);
        this.completionNote.set('');
        this.editedDescription.set(c?.description ?? '');
      }
    });
  }

  availableUsers = computed(() => {
    const assigned = this.card()?.assignedUserIds ?? [];
    return this.userService.users().filter(u => !assigned.includes(u.id));
  });

  assignees = computed(() => {
    const ids = this.card()?.assignedUserIds ?? [];
    return ids.map(id => this.userService.getUserById(id)).filter((u): u is User => !!u);
  });

  startEditingDescription(): void {
    this.editedDescription.set(this.card()?.description ?? '');
    this.isEditingDescription.set(true);
  }

  saveDescription(): void {
    const c = this.card();
    if (!c) return;
    this.cardService.updateCard(c.id, { description: this.editedDescription() }).subscribe();
    this.isEditingDescription.set(false);
  }

  cancelEditingDescription(): void {
    this.isEditingDescription.set(false);
  }

  updatePriority(priority: string): void {
    const c = this.card();
    if (c) this.cardService.updateCard(c.id, { priority }).subscribe();
  }

  updateDueDate(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const c = this.card();
    if (c) this.cardService.updateCard(c.id, { deadline: val || undefined }).subscribe();
  }

  formatDateForInput(date: Date | null | undefined): string {
    if (!date) return '';
    try { return new Date(date).toISOString().split('T')[0]; } catch { return ''; }
  }

  startComplete(): void {
    this.showCompletionForm.set(true);
    this.completionNote.set('');
  }

  confirmComplete(): void {
    const c = this.card();
    if (!c) return;
    this.cardService.completeCard(c.id, this.completionNote().trim()).subscribe();
    this.showCompletionForm.set(false);
  }

  cancelComplete(): void {
    this.showCompletionForm.set(false);
  }

  addMember(userId: string): void {
    const c = this.card();
    if (!c || (c.assignedUserIds ?? []).includes(userId)) return;
    this.cardService.assignUser(c.id, userId).subscribe(() => {
      this.showMemberPicker.set(false);
    });
  }

  removeMember(userId: string): void {
    const c = this.card();
    if (c) this.cardService.unassignUser(c.id, userId).subscribe();
  }

  getLabelColor(label: string): string {
    const palette: Record<string, string> = {
      bug: '#eb5a46', feature: '#61bd4f', enhancement: '#00c2e0',
      documentation: '#c377e0', urgent: '#ff9f1a', design: '#f87171',
      backend: '#818cf8', frontend: '#34d399', api: '#60a5fa', auth: '#a78bfa'
    };
    return palette[label.toLowerCase()] ?? '#94a3b8';
  }

  deleteCard(): void {
    const c = this.card();
    if (!c || !confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    this.cardService.deleteCard(c.id).subscribe();
    this.close();
  }

  onModalChange(val: boolean): void {
    this.isOpenChange.emit(val);
  }

  close(): void {
    this.onModalChange(false);
  }
}

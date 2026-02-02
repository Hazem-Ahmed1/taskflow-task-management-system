import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card, Priority, User } from '@core/models';
import { CardService, UserService, NotificationService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { DropdownOption } from '@shared/components/dropdown/dropdown.component';

/**
 * CardDetailComponent - Detailed card view and editing
 * 
 * Architecture:
 * - Modal for editing card details
 * - Manages card properties (title, description, priority, deadline, assignments)
 * - Handles comments and attachments
 */
@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {
  @Input() isOpen = false;
  @Input() card: Card | null = null;
  @Input() boardId!: string;
  @Input() listId!: string;
  @Output() closed = new EventEmitter<void>();

  cardForm!: FormGroup;
  newLabel = '';
  newComment = '';
  userOptions: DropdownOption[] = [];

  priorityOptions: DropdownOption[] = [
    { value: Priority.LOW, label: 'Low', icon: '🟢' },
    { value: Priority.MEDIUM, label: 'Medium', icon: '🟡' },
    { value: Priority.HIGH, label: 'High', icon: '🟠' },
    { value: Priority.URGENT, label: 'Urgent', icon: '🔴' }
  ];

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    if (!this.card) return;

    this.cardForm = this.fb.group({
      title: [this.card.title, Validators.required],
      description: [this.card.description],
      priority: [this.card.priority],
      deadline: [this.card.deadline ? new Date(this.card.deadline).toISOString().split('T')[0] : ''],
      labels: [this.card.labels || []],
      assignedUsers: [this.card.assignedUsers || []]
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.userOptions = users.map(user => ({
        value: user.id,
        label: user.name
      }));
    });
  }

  saveChanges(): void {
    if (!this.card || !this.cardForm.valid) return;

    const formValue = this.cardForm.value;
    const updates: Partial<Card> = {
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      deadline: formValue.deadline ? new Date(formValue.deadline) : undefined,
      labels: formValue.labels,
      assignedUsers: formValue.assignedUsers
    };

    this.cardService.updateCard(this.boardId, this.listId, this.card.id, updates);
    
    // Notify assigned users
    const newAssignees = formValue.assignedUsers.filter(
      (id: string) => !this.card!.assignedUsers.includes(id)
    );
    newAssignees.forEach((userId: string) => {
      this.notificationService.notifyCardAssignment(userId, formValue.title, this.card!.id);
    });

    this.close();
  }

  addLabel(): void {
    if (!this.newLabel.trim()) return;

    const labels = this.cardForm.get('labels')?.value || [];
    if (!labels.includes(this.newLabel)) {
      this.cardForm.patchValue({
        labels: [...labels, this.newLabel]
      });
    }
    this.newLabel = '';
  }

  removeLabel(label: string): void {
    const labels = this.cardForm.get('labels')?.value || [];
    this.cardForm.patchValue({
      labels: labels.filter((l: string) => l !== label)
    });
  }

  assignUser(userId: string): void {
    const assignedUsers = this.cardForm.get('assignedUsers')?.value || [];
    if (!assignedUsers.includes(userId)) {
      this.cardForm.patchValue({
        assignedUsers: [...assignedUsers, userId]
      });
    }
  }

  unassignUser(userId: string): void {
    const assignedUsers = this.cardForm.get('assignedUsers')?.value || [];
    this.cardForm.patchValue({
      assignedUsers: assignedUsers.filter((id: string) => id !== userId)
    });
  }

  addComment(): void {
    if (!this.card || !this.newComment.trim()) return;

    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;

    const comment = {
      id: `comment_${Date.now()}`,
      cardId: this.card.id,
      userId: currentUser.id,
      content: this.newComment,
      createdAt: new Date()
    };

    this.card.comments.push(comment);
    this.newComment = '';
  }

  deleteCard(): void {
    if (!this.card || !confirm('Are you sure you want to delete this card?')) return;

    this.cardService.deleteCard(this.boardId, this.listId, this.card.id);
    this.close();
  }

  getUserById(userId: string): User | undefined {
    return this.userService.getUserById(userId);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  close(): void {
    this.closed.emit();
  }
}

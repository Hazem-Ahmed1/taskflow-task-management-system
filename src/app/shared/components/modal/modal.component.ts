import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

/**
 * ModalComponent - Reusable modal dialog
 * 
 * Usage:
 * <app-modal 
 *   [isOpen]="showModal" 
 *   [title]="'Create Board'"
 *   (closed)="handleClose()">
 *   <div modal-body>Content here</div>
 *   <div modal-footer>
 *     <app-button>Save</app-button>
 *   </div>
 * </app-modal>
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() hasFooter = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  handleOverlayClick(): void {
    this.close();
  }

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closed.emit();
  }
}

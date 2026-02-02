import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * ButtonComponent - Reusable button with different variants
 * 
 * Usage:
 * <app-button 
 *   [variant]="'primary'" 
 *   [size]="'medium'"
 *   (clicked)="handleClick()">
 *   Click Me
 * </app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<void>();

  get buttonClass(): string {
    return `btn-${this.variant} btn-${this.size} ${this.fullWidth ? 'btn-full' : ''}`;
  }

  handleClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}

import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface DropdownOption {
  value: any;
  label: string;
  icon?: string;
}

/**
 * DropdownComponent - Reusable dropdown select
 * 
 * Supports ControlValueAccessor for form integration
 */
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Select an option';
  @Input() options: DropdownOption[] = [];
  @Input() disabled = false;
  @Output() selected = new EventEmitter<any>();

  isOpen = false;
  value: any = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  get selectedLabel(): string {
    const option = this.options.find(opt => opt.value === this.value);
    return option ? option.label : '';
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: DropdownOption): void {
    this.value = option.value;
    this.onChange(this.value);
    this.selected.emit(this.value);
    this.isOpen = false;
  }

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isOpen = false;
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

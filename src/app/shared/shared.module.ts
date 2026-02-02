import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { ModalComponent } from './components/modal/modal.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { AvatarComponent } from './components/avatar/avatar.component';

/**
 * SharedModule - Contains reusable components, directives, and pipes
 * 
 * Architecture:
 * - Import in feature modules that need these components
 * - All components are standalone for better tree-shaking
 * - Module for convenient importing
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    ModalComponent,
    DropdownComponent,
    AvatarComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    ModalComponent,
    DropdownComponent,
    AvatarComponent
  ]
})
export class SharedModule {}

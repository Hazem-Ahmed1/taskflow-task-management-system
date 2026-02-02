import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AvatarComponent - Display user avatar with fallback to initials
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() imageUrl = '';
  @Input() name = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  get initials(): string {
    if (!this.name) return '?';
    const parts = this.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return this.name.substring(0, 2).toUpperCase();
  }

  get backgroundColor(): string {
    // Generate consistent color based on name
    if (!this.name) return '#5e6c84';
    
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
      '#6c5ce7', '#fd79a8', '#a29bfe', '#00b894'
    ];
    
    const hash = this.name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }

  onImageError(): void {
    this.imageUrl = '';
  }
}

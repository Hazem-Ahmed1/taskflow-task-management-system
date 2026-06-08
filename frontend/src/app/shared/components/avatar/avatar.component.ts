import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  imageUrl = input('');
  name = input('');
  size = input<'small' | 'medium' | 'large'>('medium');

  get initials(): string {
    const n = this.name();
    if (!n) return '?';
    const parts = n.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : n.substring(0, 2).toUpperCase();
  }

  get backgroundColor(): string {
    const n = this.name();
    if (!n) return '#5e6c84';
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#a29bfe', '#00b894'];
    const hash = n.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return colors[Math.abs(hash) % colors.length];
  }
}

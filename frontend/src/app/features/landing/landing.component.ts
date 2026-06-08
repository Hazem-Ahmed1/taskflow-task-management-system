import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';
import { SEED_DATA } from '@core/data/seed-data';

interface PriorityStats {
  urgent: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface BoardPreview {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  isStarred: boolean;
  members: string[];
  priority: PriorityStats;
  listCount: number;
  topPriority: 'urgent' | 'high' | 'medium' | 'low' | 'none';
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  isLoggedIn = false;
  boards: BoardPreview[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isAuthenticated();

    // If already logged in, skip the preview and go straight to the real boards
    if (this.isLoggedIn) {
      this.router.navigate(['/boards']);
      return;
    }

    this.boards = SEED_DATA.boards.map(b => {
      const stats = this.calcPriority(b);
      return {
        id: b.id,
        title: b.title,
        description: b.description,
        backgroundColor: b.backgroundColor,
        isStarred: b.isStarred,
        members: b.members,
        priority: stats,
        listCount: b.lists.length,
        topPriority: this.topPriority(stats)
      };
    });
  }

  private calcPriority(board: (typeof SEED_DATA.boards)[0]): PriorityStats {
    let urgent = 0, high = 0, medium = 0, low = 0;
    for (const list of board.lists) {
      for (const card of list.cards) {
        if (card.priority === 'urgent')      urgent++;
        else if (card.priority === 'high')   high++;
        else if (card.priority === 'medium') medium++;
        else if (card.priority === 'low')    low++;
      }
    }
    return { urgent, high, medium, low, total: urgent + high + medium + low };
  }

  private topPriority(stats: PriorityStats): 'urgent' | 'high' | 'medium' | 'low' | 'none' {
    if (stats.urgent > 0) return 'urgent';
    if (stats.high   > 0) return 'high';
    if (stats.medium > 0) return 'medium';
    if (stats.low    > 0) return 'low';
    return 'none';
  }

  // ─── CTA handlers — redirect to login if not authenticated ───────────────

  /** Called when user tries to open a board */
  openBoard(boardId: string): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/boards', boardId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /** Called when user tries to create a new board */
  createBoard(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/boards']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  signIn():    void { this.router.navigate(['/login']);    }
  register():  void { this.router.navigate(['/register']); }

  getInitials(userId: string): string {
    const user = SEED_DATA.users.find(u => u.id === userId);
    if (!user) return '?';
    return user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  }

  getUserColor(userId: string): string {
    const palette = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626'];
    const index = parseInt(userId.replace(/\D/g, ''), 10) % palette.length;
    return palette[index] || '#4f46e5';
  }
}

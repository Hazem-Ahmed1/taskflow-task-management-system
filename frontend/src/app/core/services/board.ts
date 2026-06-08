import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { BoardSummary, BoardDetail } from '../models/board.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private http = inject(HttpClient);

  boards = signal<BoardSummary[]>([]);
  selectedBoard = signal<BoardDetail | null>(null);
  loading = signal(false);

  starredBoards = computed(() => this.boards().filter(b => b.isStarred));

  loadBoards() {
    this.loading.set(true);
    return this.http.get<BoardSummary[]>(`${environment.apiUrl}/boards`).pipe(
      tap({
        next: boards => { this.boards.set(boards); this.loading.set(false); },
        error: () => this.loading.set(false)
      })
    );
  }

  loadBoardById(id: string) {
    return this.http.get<BoardDetail>(`${environment.apiUrl}/boards/${id}`).pipe(
      tap(board => this.selectedBoard.set(board))
    );
  }

  createBoard(data: { title: string; description: string; backgroundColor: string }) {
    return this.http.post<BoardSummary>(`${environment.apiUrl}/boards`, data).pipe(
      tap(board => this.boards.update(bs => [board, ...bs]))
    );
  }

  updateBoard(id: string, data: Partial<{ title: string; description: string; backgroundColor: string }>) {
    return this.http.put<BoardSummary>(`${environment.apiUrl}/boards/${id}`, data).pipe(
      tap(updated => {
        this.boards.update(bs => bs.map(b => b.id === id ? updated : b));
        if (this.selectedBoard()?.id === id) {
          this.selectedBoard.update(b => b ? { ...b, ...updated } : b);
        }
      })
    );
  }

  deleteBoard(id: string) {
    return this.http.delete(`${environment.apiUrl}/boards/${id}`).pipe(
      tap(() => {
        this.boards.update(bs => bs.filter(b => b.id !== id));
        if (this.selectedBoard()?.id === id) this.selectedBoard.set(null);
      })
    );
  }

  toggleStar(id: string) {
    return this.http.put<BoardSummary>(`${environment.apiUrl}/boards/${id}/star`, {}).pipe(
      tap(updated => this.boards.update(bs => bs.map(b => b.id === id ? updated : b)))
    );
  }

  addMember(boardId: string, userId: string) {
    return this.http.post(`${environment.apiUrl}/boards/${boardId}/members`, { userId });
  }

  removeMember(boardId: string, userId: string) {
    return this.http.delete(`${environment.apiUrl}/boards/${boardId}/members/${userId}`);
  }
}

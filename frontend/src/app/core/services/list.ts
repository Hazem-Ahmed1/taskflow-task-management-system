import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { List } from '../models';
import { BoardService } from './board';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ListService {
  private http = inject(HttpClient);
  private boardService = inject(BoardService);

  createList(boardId: string, title: string) {
    return this.http.post<List>(`${environment.apiUrl}/boards/${boardId}/lists`, { title }).pipe(
      tap(list => {
        this.boardService.selectedBoard.update(board =>
          board ? { ...board, lists: [...board.lists, list] } : board
        );
      })
    );
  }

  updateList(listId: string, data: { title: string }) {
    return this.http.put<List>(`${environment.apiUrl}/lists/${listId}`, data).pipe(
      tap(updated => {
        this.boardService.selectedBoard.update(board =>
          board
            ? { ...board, lists: board.lists.map(l => l.id === listId ? updated : l) }
            : board
        );
      })
    );
  }

  deleteList(listId: string) {
    return this.http.delete(`${environment.apiUrl}/lists/${listId}`).pipe(
      tap(() => {
        this.boardService.selectedBoard.update(board =>
          board
            ? { ...board, lists: board.lists.filter(l => l.id !== listId) }
            : board
        );
      })
    );
  }

  reorderLists(boardId: string, listIds: string[]) {
    return this.http.put(`${environment.apiUrl}/boards/${boardId}/lists/reorder`, { listIds });
  }
}

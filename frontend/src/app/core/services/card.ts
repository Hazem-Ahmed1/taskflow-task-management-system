import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Card, CardDetail } from '../models/card.model';
import { BoardService } from './board';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CardService {
  private http = inject(HttpClient);
  private boardService = inject(BoardService);

  createCard(listId: string, data: { title: string; description?: string; priority?: string }) {
    return this.http.post<Card>(`${environment.apiUrl}/lists/${listId}/cards`, data).pipe(
      tap(card => {
        this.boardService.selectedBoard.update(board =>
          board
            ? {
                ...board,
                lists: board.lists.map(l =>
                  l.id === listId ? { ...l, cards: [...l.cards, card] } : l
                )
              }
            : board
        );
      })
    );
  }

  getCardDetail(cardId: string) {
    return this.http.get<CardDetail>(`${environment.apiUrl}/cards/${cardId}`);
  }

  updateCard(cardId: string, data: Partial<{ title: string; description: string; priority: string; deadline: string; labels: string[] }>) {
    return this.http.put<Card>(`${environment.apiUrl}/cards/${cardId}`, data).pipe(
      tap(updated => {
        this.boardService.selectedBoard.update(board =>
          board
            ? {
                ...board,
                lists: board.lists.map(l => ({
                  ...l,
                  cards: l.cards.map(c => c.id === cardId ? updated : c)
                }))
              }
            : board
        );
      })
    );
  }

  deleteCard(cardId: string) {
    return this.http.delete(`${environment.apiUrl}/cards/${cardId}`).pipe(
      tap(() => {
        this.boardService.selectedBoard.update(board =>
          board
            ? {
                ...board,
                lists: board.lists.map(l => ({
                  ...l,
                  cards: l.cards.filter(c => c.id !== cardId)
                }))
              }
            : board
        );
      })
    );
  }

  moveCard(cardId: string, targetListId: string, position: number) {
    return this.http.put<Card>(`${environment.apiUrl}/cards/${cardId}/move`, { targetListId, position });
  }

  assignUser(cardId: string, userId: string) {
    return this.http.post(`${environment.apiUrl}/cards/${cardId}/assignees/${userId}`, {});
  }

  unassignUser(cardId: string, userId: string) {
    return this.http.delete(`${environment.apiUrl}/cards/${cardId}/assignees/${userId}`);
  }

  completeCard(cardId: string, completionNote?: string) {
    return this.http.put<Card>(`${environment.apiUrl}/cards/${cardId}/complete`, { completionNote }).pipe(
      tap(updated => {
        this.boardService.selectedBoard.update(board =>
          board
            ? {
                ...board,
                lists: board.lists.map(l => ({
                  ...l,
                  cards: l.cards.map(c => c.id === cardId ? updated : c)
                }))
              }
            : board
        );
      })
    );
  }
}

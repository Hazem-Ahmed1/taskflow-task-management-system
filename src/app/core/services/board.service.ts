import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  private selectedBoardSubject = new BehaviorSubject<Board | null>(null);

  public boards$: Observable<Board[]> = this.boardsSubject.asObservable();
  public selectedBoard$: Observable<Board | null> = this.selectedBoardSubject.asObservable();

  constructor(private db: DatabaseService) {}

  loadBoardsForUser(userId: string): void {
    const boards = this.db.getBoardsByUser(userId).map(b => this.hydrateBoard(b as unknown as Board));
    this.boardsSubject.next(boards);
  }

  getBoards(): Observable<Board[]> {
    return this.boards$;
  }

  getBoardById(id: string): Board | undefined {
    return this.boardsSubject.value.find(b => b.id === id);
  }

  /**
   * Find which board contains a specific card.
   * Used by notification deep-links to open the right board/task.
   */
  findBoardIdByCardId(cardId: string): string | null {
    for (const board of this.boardsSubject.value) {
      for (const list of board.lists) {
        if (list.cards.some(card => card.id === cardId)) {
          return board.id;
        }
      }
    }
    return null;
  }

  createBoard(board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Board {
    const newBoard: Board = {
      ...board,
      id: this.db.generateId('board'),
      createdAt: new Date(),
      updatedAt: new Date(),
      lists: []
    };
    this.db.createBoard(newBoard);
    const current = this.boardsSubject.value;
    this.boardsSubject.next([...current, newBoard]);
    return newBoard;
  }

  updateBoard(id: string, updates: Partial<Board>): void {
    this.db.updateBoard(id, updates);
    const boards = this.boardsSubject.value.map(b =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
    );
    this.boardsSubject.next(boards);

    const selected = this.selectedBoardSubject.value;
    if (selected?.id === id) {
      this.selectedBoardSubject.next({ ...selected, ...updates, updatedAt: new Date() });
    }
  }

  deleteBoard(id: string): void {
    this.db.deleteBoard(id);
    const boards = this.boardsSubject.value.filter(b => b.id !== id);
    this.boardsSubject.next(boards);
    if (this.selectedBoardSubject.value?.id === id) {
      this.selectedBoardSubject.next(null);
    }
  }

  selectBoard(board: Board | null): void {
    this.selectedBoardSubject.next(board);
  }

  toggleStar(id: string): void {
    const board = this.getBoardById(id);
    if (!board) return;
    this.updateBoard(id, { isStarred: !board.isStarred });
  }

  addMember(boardId: string, userId: string): void {
    const board = this.getBoardById(boardId);
    if (!board || board.members.includes(userId)) return;
    this.updateBoard(boardId, { members: [...board.members, userId] });
  }

  removeMember(boardId: string, userId: string): void {
    const board = this.getBoardById(boardId);
    if (!board) return;
    this.updateBoard(boardId, { members: board.members.filter(id => id !== userId) });
  }

  private hydrateBoard(board: Board): Board {
    return {
      ...board,
      createdAt: new Date(board.createdAt),
      updatedAt: new Date(board.updatedAt)
    };
  }
}

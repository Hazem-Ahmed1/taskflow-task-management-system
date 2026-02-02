import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models';

/**
 * BoardService - Manages all board-related operations
 * 
 * Architecture:
 * - Uses BehaviorSubject for reactive state management
 * - Provides CRUD operations for boards
 * - Maintains a single source of truth for board data
 */
@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  private selectedBoardSubject = new BehaviorSubject<Board | null>(null);

  public boards$: Observable<Board[]> = this.boardsSubject.asObservable();
  public selectedBoard$: Observable<Board | null> = this.selectedBoardSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  /**
   * Get all boards
   */
  getBoards(): Observable<Board[]> {
    return this.boards$;
  }

  /**
   * Get board by ID
   */
  getBoardById(id: string): Board | undefined {
    return this.boardsSubject.value.find(board => board.id === id);
  }

  /**
   * Create new board
   */
  createBoard(board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Board {
    const newBoard: Board = {
      ...board,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lists: []
    };

    const boards = [...this.boardsSubject.value, newBoard];
    this.boardsSubject.next(boards);
    return newBoard;
  }

  /**
   * Update existing board
   */
  updateBoard(id: string, updates: Partial<Board>): void {
    const boards = this.boardsSubject.value.map(board =>
      board.id === id
        ? { ...board, ...updates, updatedAt: new Date() }
        : board
    );
    this.boardsSubject.next(boards);

    // Update selected board if it's the one being updated
    const selectedBoard = this.selectedBoardSubject.value;
    if (selectedBoard && selectedBoard.id === id) {
      this.selectedBoardSubject.next({ ...selectedBoard, ...updates, updatedAt: new Date() });
    }
  }

  /**
   * Delete board
   */
  deleteBoard(id: string): void {
    const boards = this.boardsSubject.value.filter(board => board.id !== id);
    this.boardsSubject.next(boards);

    // Clear selected board if it's the one being deleted
    if (this.selectedBoardSubject.value?.id === id) {
      this.selectedBoardSubject.next(null);
    }
  }

  /**
   * Select a board
   */
  selectBoard(board: Board | null): void {
    this.selectedBoardSubject.next(board);
  }

  /**
   * Toggle board star
   */
  toggleStar(id: string): void {
    const boards = this.boardsSubject.value.map(board =>
      board.id === id
        ? { ...board, isStarred: !board.isStarred }
        : board
    );
    this.boardsSubject.next(boards);
  }

  /**
   * Add member to board
   */
  addMember(boardId: string, userId: string): void {
    const boards = this.boardsSubject.value.map(board =>
      board.id === boardId
        ? { ...board, members: [...board.members, userId] }
        : board
    );
    this.boardsSubject.next(boards);
  }

  /**
   * Remove member from board
   */
  removeMember(boardId: string, userId: string): void {
    const boards = this.boardsSubject.value.map(board =>
      board.id === boardId
        ? { ...board, members: board.members.filter(id => id !== userId) }
        : board
    );
    this.boardsSubject.next(boards);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize with mock data for demonstration
   */
  private initializeMockData(): void {
    const mockBoards: Board[] = [
      {
        id: 'board_1',
        title: 'Project Alpha',
        description: 'Main project board',
        ownerId: 'user_1',
        members: ['user_1', 'user_2'],
        lists: [],
        backgroundColor: '#0079bf',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        isStarred: true
      },
      {
        id: 'board_2',
        title: 'Marketing Campaign',
        description: 'Q1 Marketing initiatives',
        ownerId: 'user_1',
        members: ['user_1', 'user_3'],
        lists: [],
        backgroundColor: '#d29034',
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date('2026-01-15'),
        isStarred: false
      }
    ];

    this.boardsSubject.next(mockBoards);
  }
}

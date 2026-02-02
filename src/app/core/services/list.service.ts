import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from '../models';
import { BoardService } from './board.service';

/**
 * ListService - Manages all list-related operations
 * 
 * Architecture:
 * - Handles list CRUD operations
 * - Manages list positioning and ordering
 * - Communicates with BoardService for data consistency
 */
@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor(private boardService: BoardService) {}

  /**
   * Create new list
   */
  createList(boardId: string, title: string): List {
    const board = this.boardService.getBoardById(boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    const newList: List = {
      id: this.generateId(),
      title,
      boardId,
      position: board.lists.length,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedLists = [...board.lists, newList];
    this.boardService.updateBoard(boardId, { lists: updatedLists });

    return newList;
  }

  /**
   * Update list
   */
  updateList(boardId: string, listId: string, updates: Partial<List>): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const updatedLists = board.lists.map(list =>
      list.id === listId
        ? { ...list, ...updates, updatedAt: new Date() }
        : list
    );

    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  /**
   * Delete list
   */
  deleteList(boardId: string, listId: string): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const updatedLists = board.lists
      .filter(list => list.id !== listId)
      .map((list, index) => ({ ...list, position: index }));

    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  /**
   * Reorder lists
   */
  reorderLists(boardId: string, lists: List[]): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const reorderedLists = lists.map((list, index) => ({
      ...list,
      position: index
    }));

    this.boardService.updateBoard(boardId, { lists: reorderedLists });
  }

  /**
   * Get list by ID
   */
  getListById(boardId: string, listId: string): List | undefined {
    const board = this.boardService.getBoardById(boardId);
    return board?.lists.find(list => list.id === listId);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

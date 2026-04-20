import { Injectable } from '@angular/core';
import { List } from '../models';
import { ActivityAction } from '../models/activity.model';
import { BoardService } from './board';
import { ActivityService } from './activity';

@Injectable({ providedIn: 'root' })
export class ListService {
  constructor(private boardService: BoardService, private activity: ActivityService) {}

  createList(boardId: string, title: string): List {
    const board = this.boardService.getBoardById(boardId);
    if (!board) throw new Error('Board not found');

    const newList: List = {
      id: this.generateId(),
      title,
      boardId,
      position: board.lists.length,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.boardService.updateBoard(boardId, { lists: [...board.lists, newList] });

    this.activity.log(
      ActivityAction.LIST_CREATED,
      `Added list "${title}" to board "${board.title}"`,
      { boardId, boardTitle: board.title }
    );

    return newList;
  }

  updateList(boardId: string, listId: string, updates: Partial<List>): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const updatedLists = board.lists.map(list =>
      list.id === listId ? { ...list, ...updates, updatedAt: new Date() } : list
    );
    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  deleteList(boardId: string, listId: string): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    const updatedLists = board.lists
      .filter(l => l.id !== listId)
      .map((l, index) => ({ ...l, position: index }));

    this.boardService.updateBoard(boardId, { lists: updatedLists });

    if (list) {
      this.activity.log(
        ActivityAction.LIST_DELETED,
        `Deleted list "${list.title}" from board "${board.title}"`,
        { boardId, boardTitle: board.title }
      );
    }
  }

  reorderLists(boardId: string, lists: List[]): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;
    this.boardService.updateBoard(boardId, {
      lists: lists.map((l, i) => ({ ...l, position: i }))
    });
  }

  getListById(boardId: string, listId: string): List | undefined {
    return this.boardService.getBoardById(boardId)?.lists.find(l => l.id === listId);
  }

  private generateId(): string {
    return `list_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

import { Injectable } from '@angular/core';
import { Card, Priority } from '../models';
import { BoardService } from './board.service';

/**
 * CardService - Manages all card-related operations
 * 
 * Architecture:
 * - Handles card CRUD operations
 * - Manages card positioning within lists
 * - Supports drag & drop operations
 * - Handles card assignments and priorities
 */
@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private boardService: BoardService) {}

  /**
   * Create new card
   */
  createCard(
    boardId: string,
    listId: string,
    cardData: Omit<Card, 'id' | 'listId' | 'boardId' | 'createdAt' | 'updatedAt' | 'position'>
  ): Card {
    const board = this.boardService.getBoardById(boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    const list = board.lists.find(l => l.id === listId);
    if (!list) {
      throw new Error('List not found');
    }

    const newCard: Card = {
      ...cardData,
      id: this.generateId(),
      listId,
      boardId,
      position: list.cards.length,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      attachments: []
    };

    const updatedLists = board.lists.map(l =>
      l.id === listId
        ? { ...l, cards: [...l.cards, newCard] }
        : l
    );

    this.boardService.updateBoard(boardId, { lists: updatedLists });
    return newCard;
  }

  /**
   * Update card
   */
  updateCard(boardId: string, listId: string, cardId: string, updates: Partial<Card>): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const updatedLists = board.lists.map(list =>
      list.id === listId
        ? {
            ...list,
            cards: list.cards.map(card =>
              card.id === cardId
                ? { ...card, ...updates, updatedAt: new Date() }
                : card
            )
          }
        : list
    );

    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  /**
   * Delete card
   */
  deleteCard(boardId: string, listId: string, cardId: string): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const updatedLists = board.lists.map(list =>
      list.id === listId
        ? {
            ...list,
            cards: list.cards
              .filter(card => card.id !== cardId)
              .map((card, index) => ({ ...card, position: index }))
          }
        : list
    );

    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  /**
   * Move card to different list
   */
  moveCard(
    boardId: string,
    sourceListId: string,
    targetListId: string,
    cardId: string,
    newPosition: number
  ): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const sourceList = board.lists.find(l => l.id === sourceListId);
    const card = sourceList?.cards.find(c => c.id === cardId);
    
    if (!card) return;

    const updatedCard = { ...card, listId: targetListId, position: newPosition };

    const updatedLists = board.lists.map(list => {
      // Remove from source list
      if (list.id === sourceListId) {
        return {
          ...list,
          cards: list.cards
            .filter(c => c.id !== cardId)
            .map((c, index) => ({ ...c, position: index }))
        };
      }
      // Add to target list
      if (list.id === targetListId) {
        const newCards = [...list.cards];
        newCards.splice(newPosition, 0, updatedCard);
        return {
          ...list,
          cards: newCards.map((c, index) => ({ ...c, position: index }))
        };
      }
      return list;
    });

    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  /**
   * Reorder cards within same list
   */
  reorderCards(boardId: string, listId: string, cards: Card[]): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const reorderedCards = cards.map((card, index) => ({
      ...card,
      position: index
    }));

    const updatedLists = board.lists.map(list =>
      list.id === listId
        ? { ...list, cards: reorderedCards }
        : list
    );

    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  /**
   * Assign user to card
   */
  assignUser(boardId: string, listId: string, cardId: string, userId: string): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    const card = list?.cards.find(c => c.id === cardId);

    if (!card || card.assignedUsers.includes(userId)) return;

    this.updateCard(boardId, listId, cardId, {
      assignedUsers: [...card.assignedUsers, userId]
    });
  }

  /**
   * Unassign user from card
   */
  unassignUser(boardId: string, listId: string, cardId: string, userId: string): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    const card = list?.cards.find(c => c.id === cardId);

    if (!card) return;

    this.updateCard(boardId, listId, cardId, {
      assignedUsers: card.assignedUsers.filter(id => id !== userId)
    });
  }

  /**
   * Get card by ID
   */
  getCardById(boardId: string, listId: string, cardId: string): Card | undefined {
    const board = this.boardService.getBoardById(boardId);
    const list = board?.lists.find(l => l.id === listId);
    return list?.cards.find(c => c.id === cardId);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

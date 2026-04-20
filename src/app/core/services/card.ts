import { Injectable } from '@angular/core';
import { Card, Priority } from '../models';
import { ActivityAction } from '../models/activity.model';
import { BoardService } from './board';
// import { ActivityService } from './activity';
import {ActivityService} from './activity';

@Injectable({ providedIn: 'root' })
export class CardService {
  constructor(private boardService: BoardService, private activity: ActivityService) {}

  createCard(
    boardId: string,
    listId: string,
    cardData: Omit<Card, 'id' | 'listId' | 'boardId' | 'createdAt' | 'updatedAt' | 'position'>
  ): Card {
    const board = this.boardService.getBoardById(boardId);
    if (!board) throw new Error('Board not found');

    const list = board.lists.find(l => l.id === listId);
    if (!list) throw new Error('List not found');

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
      l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l
    );
    this.boardService.updateBoard(boardId, { lists: updatedLists });

    this.activity.log(
      ActivityAction.CARD_CREATED,
      `Created card "${newCard.title}" in list "${list.title}"`,
      { boardId, boardTitle: board.title, cardId: newCard.id }
    );

    return newCard;
  }

  updateCard(boardId: string, listId: string, cardId: string, updates: Partial<Card>): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const updatedLists = board.lists.map(list =>
      list.id === listId
        ? {
            ...list,
            cards: list.cards.map(card =>
              card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
            )
          }
        : list
    );
    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  deleteCard(boardId: string, listId: string, cardId: string): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    const card = list?.cards.find(c => c.id === cardId);

    const updatedLists = board.lists.map(l =>
      l.id === listId
        ? {
            ...l,
            cards: l.cards
              .filter(c => c.id !== cardId)
              .map((c, i) => ({ ...c, position: i }))
          }
        : l
    );
    this.boardService.updateBoard(boardId, { lists: updatedLists });

    if (card && list) {
      this.activity.log(
        ActivityAction.CARD_DELETED,
        `Deleted card "${card.title}" from list "${list.title}"`,
        { boardId, boardTitle: board.title }
      );
    }
  }

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
      if (list.id === sourceListId) {
        return {
          ...list,
          cards: list.cards
            .filter(c => c.id !== cardId)
            .map((c, i) => ({ ...c, position: i }))
        };
      }
      if (list.id === targetListId) {
        const newCards = [...list.cards];
        newCards.splice(newPosition, 0, updatedCard);
        return { ...list, cards: newCards.map((c, i) => ({ ...c, position: i })) };
      }
      return list;
    });

    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  reorderCards(boardId: string, listId: string, cards: Card[]): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const updatedLists = board.lists.map(list =>
      list.id === listId
        ? { ...list, cards: cards.map((c, i) => ({ ...c, position: i })) }
        : list
    );
    this.boardService.updateBoard(boardId, { lists: updatedLists });
  }

  assignUser(boardId: string, listId: string, cardId: string, userId: string): void {
    const board = this.boardService.getBoardById(boardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    const card = list?.cards.find(c => c.id === cardId);
    if (!card || card.assignedUsers.includes(userId)) return;

    this.updateCard(boardId, listId, cardId, {
      assignedUsers: [...card.assignedUsers, userId]
    });

    // Ensure assignees can access the board they are assigned work in.
    this.boardService.addMember(boardId, userId);
  }

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

  getCardById(boardId: string, listId: string, cardId: string): Card | undefined {
    const board = this.boardService.getBoardById(boardId);
    const list = board?.lists.find(l => l.id === listId);
    return list?.cards.find(c => c.id === cardId);
  }

  private generateId(): string {
    return `card_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

import { Card } from './card.model';

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

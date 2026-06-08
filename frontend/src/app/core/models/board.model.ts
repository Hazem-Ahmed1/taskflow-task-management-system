import { User } from './user.model';
import { List } from './list.model';

export interface BoardSummary {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  backgroundColor: string;
  isStarred: boolean;
  memberIds: string[];
  listCount: number;
  cardCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardDetail {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  backgroundColor: string;
  isStarred: boolean;
  members: User[];
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
}

// Alias kept for components that reference Board generically
export type Board = BoardDetail;

import { List } from './list.model';

export interface Board {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  members: string[]; // User IDs
  lists: List[];
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
  isStarred: boolean;
}

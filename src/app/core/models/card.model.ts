export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
  boardId: string;
  assignedUsers: string[]; // User IDs
  priority: Priority;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  position: number;
  labels: string[];
  comments: Comment[];
  attachments: Attachment[];
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  cardId: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
  boardId: string;
  assignedUserIds: string[];
  priority: Priority;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  position: number;
  labels: string[];
  commentCount: number;
  attachmentCount: number;
  isCompleted: boolean;
  completionNote?: string;
}

export interface CardDetail extends Omit<Card, 'commentCount' | 'attachmentCount'> {
  assignedUsers: { id: string; name: string; email: string; avatar?: string }[];
  comments: Comment[];
  attachments: Attachment[];
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  userName: string;
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

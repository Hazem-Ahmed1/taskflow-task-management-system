export enum NotificationType {
  CARD_ASSIGNED = 'card_assigned',
  CARD_UPDATED = 'card_updated',
  CARD_COMMENT = 'card_comment',
  DEADLINE_APPROACHING = 'deadline_approaching',
  BOARD_INVITATION = 'board_invitation'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId: string; // Card ID, Board ID, etc.
  isRead: boolean;
  createdAt: Date;
}

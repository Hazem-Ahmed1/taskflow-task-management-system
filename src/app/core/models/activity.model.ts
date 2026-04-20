export enum ActivityAction {
  BOARD_CREATED = 'board_created',
  BOARD_UPDATED = 'board_updated',
  BOARD_DELETED = 'board_deleted',
  LIST_CREATED  = 'list_created',
  LIST_DELETED  = 'list_deleted',
  CARD_CREATED  = 'card_created',
  CARD_DELETED  = 'card_deleted',
  CARD_COMPLETED = 'card_completed',
  MEMBER_ASSIGNED = 'member_assigned',
  MEMBER_ADDED    = 'member_added',
}

export interface ActivityEntry {
  id: string;
  userId: string;
  action: ActivityAction;
  /** Human-readable sentence, e.g. "Added list 'To Do' to 'Website Redesign'" */
  description: string;
  boardId?: string;
  boardTitle?: string;
  cardId?: string;
  createdAt: Date;
}

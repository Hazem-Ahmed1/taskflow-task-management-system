import { Injectable } from '@angular/core';

/**
 * Bridge service that lets the notification center tell
 * BoardContentComponent which card to open after navigation.
 *
 * Pattern:
 *   NotificationCenter  →  setPendingCard(cardId)  →  router.navigate(['/boards', boardId])
 *   BoardContentComponent  →  consumePendingCard()  →  opens card modal
 */
@Injectable({ providedIn: 'root' })
export class CardNavigationService {
  private _pendingCardId: string | null = null;

  setPendingCard(cardId: string): void {
    this._pendingCardId = cardId;
  }

  consumePendingCard(): string | null {
    const id = this._pendingCardId;
    this._pendingCardId = null;
    return id;
  }
}

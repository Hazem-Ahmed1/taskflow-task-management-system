import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ActivityEntry } from '../models/activity.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);

  activities = signal<ActivityEntry[]>([]);

  loadAll() {
    return this.http.get<ActivityEntry[]>(`${environment.apiUrl}/activity`).pipe(
      tap(entries => this.activities.set(entries))
    );
  }

  loadForBoard(boardId: string) {
    return this.http.get<ActivityEntry[]>(`${environment.apiUrl}/boards/${boardId}/activity`).pipe(
      tap(entries => this.activities.set(entries))
    );
  }
}

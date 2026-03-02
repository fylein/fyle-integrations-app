import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationLockService {
  isLocked = signal(false);

  tooltipText = signal<string | undefined>(undefined);

  lock(message: string): void {
    this.isLocked.set(true);
    this.tooltipText.set(message);
  }

  unlock(): void {
    this.isLocked.set(false);
    this.tooltipText.set(undefined);
  }
}

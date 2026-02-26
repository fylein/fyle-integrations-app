import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationLockService {
  isLocked = signal(false);

  lock(): void {
    this.isLocked.set(true);
  }

  unlock(): void {
    this.isLocked.set(false);
  }
}

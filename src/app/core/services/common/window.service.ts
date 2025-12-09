import { Injectable } from '@angular/core';
import { OperatingSystem } from '../../models/enum/enum.model';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  constructor() {}

  get nativeWindow(): Window {
    return window;
  }

  redirect(url: string): void {
    this.nativeWindow.location.href = url;
  }

  openInNewTab(url: string): void {
    this.nativeWindow.open(url, '_blank');
  }

  getOperatingSystem(): string {
    const userAgent = this.nativeWindow.navigator.userAgent;

    if (userAgent.includes(OperatingSystem.WIN)) {
      return OperatingSystem.WIN;
    } else if (userAgent.includes(OperatingSystem.MAC)) {
      return OperatingSystem.MAC;
    }
    return '';
  }
}

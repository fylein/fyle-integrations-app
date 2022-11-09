import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor() { }

  get nativeWindow(): Window {
    return window;
  }

  redirect(url: string): void {
    this.nativeWindow.location.href = url;
  }

  openInNewTab(url: string): void {
    this.nativeWindow.open(url, '_blank');
  }
}

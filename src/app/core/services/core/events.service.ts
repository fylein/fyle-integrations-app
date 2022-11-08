import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private windowService: WindowService
  ) { }

  receiveEvent(): void {
    this.windowService.nativeWindow.addEventListener('message', (message) => {
      if (message.origin === environment.fyle_app_url && message.data && message.data.redirectUri) {
        this.windowService.openInNewTab(message.data.redirectUri);
      }
    }, false);
  }

  postEvent(callbackUrl: string, clientId: string): void {
    const payload = { callbackUrl, clientId };
    this.windowService.nativeWindow.parent.postMessage(payload, environment.fyle_app_url);
  }
}

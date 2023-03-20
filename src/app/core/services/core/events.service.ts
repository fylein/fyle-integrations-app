import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkatoConnectionStatus } from '../../models/travelperk/travelperk.model';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  @Output() getWorkatoConnectionStatus: EventEmitter<WorkatoConnectionStatus> = new EventEmitter();

  constructor(
    private windowService: WindowService
  ) { }

  receiveEvent(): void {
    this.windowService.nativeWindow.addEventListener('message', (message) => {
      if (message.data && message.data.redirectUri && message.origin === environment.fyle_app_url) {
        this.windowService.openInNewTab(message.data.redirectUri);
      } else if (message.data && JSON.parse(message.data).type === 'connectionStatusChange' && message.origin.includes('workato')) {
        this.getWorkatoConnectionStatus.emit(JSON.parse(message.data));
      }
    }, false);
  }

  postEvent(callbackUrl: string, clientId: string): void {
    const payload = { callbackUrl, clientId };
    this.windowService.nativeWindow.parent.postMessage(payload, environment.fyle_app_url);
  }
}

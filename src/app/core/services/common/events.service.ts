import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkatoConnectionStatus } from '../../models/travelperk/travelperk.model';
import { WindowService } from './window.service';
import { NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';

export const EXPOSE_INTACCT_NEW_APP = true;

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  @Output() getWorkatoConnectionStatus: EventEmitter<WorkatoConnectionStatus> = new EventEmitter();

  @Output() sageIntacctLogin: EventEmitter<string> = new EventEmitter();

  @Output() redirectToOldIntacctApp: EventEmitter<string> = new EventEmitter();

  constructor(
    private location: Location,
    private router: Router,
    private windowService: WindowService
  ) { }

  receiveEvent(): void {
    this.windowService.nativeWindow.addEventListener('message', (message) => {
      if (message.data && message.data.redirectUri && message.origin === environment.fyle_app_url) {
        if (EXPOSE_INTACCT_NEW_APP && message.data.redirectUri.includes('sage-intacct')) {
          this.sageIntacctLogin.emit(message.data.redirectUri);
          this.redirectToOldIntacctApp.emit(message.data.redirectUri);
        } else {
          this.windowService.openInNewTab(message.data.redirectUri);
        }
      } else if (message.data && message.data.navigateBack) {
        this.location.back();
      } else if (message.data && typeof (message.data) !== 'object' && JSON.parse(message.data).type === 'connectionStatusChange' && message.origin.includes('workato')) {
        this.getWorkatoConnectionStatus.emit(JSON.parse(message.data));
      }
    }, false);
  }

  postEvent(payload: Object): void {
    this.windowService.nativeWindow.parent.postMessage(payload, environment.fyle_app_url);
  }

  setupRouteWatcher(): void {
    this.postEvent({ updateIframedAppNavigationAvailability: true });
    this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationStart) {
        if (routerEvent.restoredState && routerEvent.restoredState.navigationId === 1) {
          this.postEvent({ updateIframedAppNavigationAvailability: false });
        } else {
          const payload = { currentRoute: routerEvent.url.substring(1) };
          this.postEvent(payload);
        }
      }
    });
  }
}

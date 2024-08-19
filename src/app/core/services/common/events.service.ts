import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkatoConnectionStatus } from '../../models/travelperk/travelperk.model';
import { WindowService } from './window.service';
import { NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';
import { brandingConfig } from 'src/app/branding/c1-contents-config';


const MODULE_PATHS = ['mapping', 'export_log', 'configuration', 'intacct', 'qbd'];

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  @Output() getWorkatoConnectionStatus: EventEmitter<WorkatoConnectionStatus> = new EventEmitter();

  @Output() sageIntacctLogin: EventEmitter<string> = new EventEmitter();

  @Output() qboLogin: EventEmitter<string> = new EventEmitter();

  @Output() xeroLogin: EventEmitter<string> = new EventEmitter();

  @Output() netsuiteLogin: EventEmitter<string> = new EventEmitter();

  history: string[] = [];

  constructor(
    private location: Location,
    private router: Router,
    private windowService: WindowService
  ) { }

  private navigateBack(): void {
    this.location.back();
    this.history.pop();
  }

  private checkStateAndNavigate(): void {
    this.navigateBack();

    // Pick last item from history
    const lastItem: string = this.history[this.history.length - 1];

    // If last item is module path, then go back again
    if (lastItem && MODULE_PATHS.indexOf((lastItem.split('/').pop() as string)) > -1) {
      this.navigateBack();
    } else {
      return;
    }
  }

  receiveEvent(): void {
    this.windowService.nativeWindow.addEventListener('message', (message) => {
      if (message.data && message.data.redirectUri && (message.origin === environment.fyle_app_url || message.origin === environment.fyle_app_local)) {
        if (message.data.redirectUri.includes('sage-intacct')) {
          this.sageIntacctLogin.emit(message.data.redirectUri);
        } else if (message.data.redirectUri.includes('quickbooks')) {
          this.qboLogin.emit(message.data.redirectUri);
        } else if (message.data.redirectUri.includes('xero')) {
          this.xeroLogin.emit(message.data.redirectUri);
        } else if (message.data.redirectUri.includes('netsuite')) {
          this.netsuiteLogin.emit(message.data.redirectUri);
        } else {
          this.windowService.openInNewTab(message.data.redirectUri);
        }
      } else if (message.data && message.data.navigateBack) {
        this.checkStateAndNavigate();
      } else if (message.data && typeof (message.data) !== 'object' && JSON.parse(message.data).type === 'connectionStatusChange' && message.origin.includes('workato')) {
        this.getWorkatoConnectionStatus.emit(JSON.parse(message.data));
      }
    }, false);
  }

  postEvent(payload: Object): void {
    this.windowService.nativeWindow.parent.postMessage(payload, environment.fyle_app_url);
  }

  setupRouteWatcher(): void {
    // Updating the iframe app navigation availability to true on page load
    this.postEvent({ updateIframedAppNavigationAvailability: true });
    this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationStart) {
        // Add the current route to the history stack only if the user is navigating forward
        if (!routerEvent.restoredState) {
          this.history.push(routerEvent.url);
        }
        // Updating the iframe app navigation availability to false when user comes back to the initial page
        if (routerEvent.restoredState && routerEvent.restoredState.navigationId <= 3) {
          this.postEvent({ updateIframedAppNavigationAvailability: false });
        } else {
          // Keep updating the current route to the parent app to help in navigation during browser refresh
          const payload = { currentRoute: routerEvent.url.substring(1) };
          this.postEvent(payload);
        }
      }
    });
  }
}

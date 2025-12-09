import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkatoConnectionStatus } from '../../models/travelperk/travelperk.model';
import { WindowService } from './window.service';
import { NavigationStart, Router } from '@angular/router';

const MODULE_PATHS = [
  'main',
  'mapping',
  'export_log',
  'configuration',
  'onboarding',
  'bamboo_hr',
  'qbd',
  'travelperk',
  'intacct',
  'qbo',
  'sage300',
  'business_central',
  'netsuite',
  'xero',
  'qbd_direct',
];

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  @Output() getWorkatoConnectionStatus: EventEmitter<WorkatoConnectionStatus> = new EventEmitter();

  @Output() sageIntacctLogin: EventEmitter<string> = new EventEmitter();

  @Output() qboLogin: EventEmitter<string> = new EventEmitter();

  @Output() xeroLogin: EventEmitter<string> = new EventEmitter();

  @Output() netsuiteLogin: EventEmitter<string> = new EventEmitter();

  history: string[] = [];

  constructor(
    private router: Router,
    private windowService: WindowService,
  ) {
    // Initially, we have no previous page to navigate to. So, hide the back button
    this.postEvent({ updateIframedAppNavigationAvailability: false });
  }

  private isModule(path: string) {
    return MODULE_PATHS.includes(path.split('/').pop() as string);
  }

  private get isNavigationAvailable() {
    // If there is no previous route to go to
    if (this.history.length < 2) {
      return false;
    }

    // If there is any non-module route before the last route,
    // Then navigation is available
    for (let i = 0; i < this.history.length - 1; i++) {
      if (!this.isModule(this.history[i])) {
        return true;
      }
    }

    // Otherwise, we are on the first visited route
    return false;
  }

  private navigateBack(numberOfPages = 1): void {
    const x = this.history.splice(-numberOfPages, numberOfPages);
    if (this.history.length > 0) {
      this.router.navigate([this.history[this.history.length - 1]], { skipLocationChange: true });
    }
  }

  private checkStateAndNavigate(): void {
    let numberOfPages = 1;

    // Start checking from second-to-last item
    for (let i = this.history.length - 2; i >= 0; i--) {
      const currentRoute: string = this.history[i];

      // If this route is a module, then go back again
      if (currentRoute && this.isModule(currentRoute)) {
        numberOfPages++;
      } else {
        break;
      }
    }

    this.navigateBack(numberOfPages);
  }

  receiveEvent(): void {
    this.windowService.nativeWindow.addEventListener(
      'message',
      (message) => {
        if (
          message.data &&
          message.data.redirectUri &&
          (message.origin === environment.fyle_app_url || message.origin === environment.fyle_app_local)
        ) {
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
        } else if (
          message.data &&
          typeof message.data !== 'object' &&
          JSON.parse(message.data).type === 'connectionStatusChange' &&
          message.origin.includes('workato')
        ) {
          this.getWorkatoConnectionStatus.emit(JSON.parse(message.data));
        }
      },
      false,
    );
  }

  postEvent(payload: Object): void {
    this.windowService.nativeWindow.parent.postMessage(payload, environment.fyle_app_url);
  }

  setupRouteWatcher(): void {
    this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationStart) {
        // Keep updating the current route to the parent app to help in navigation during browser refresh
        this.postEvent({
          currentRoute: routerEvent.url.substring(1),
        });

        // Check if this route has already been added to history - this happens with export_logs
        const isDuplicate = this.history.length > 0 && routerEvent.url === this.history[this.history.length - 1];

        // Add the current route to the history stack only if the user is navigating forward
        if (!routerEvent.restoredState && !isDuplicate) {
          this.history.push(routerEvent.url);
        }

        // Hide the 'back' button in fyle app if there is no previous navigatable page
        this.postEvent({
          updateIframedAppNavigationAvailability: this.isNavigationAvailable,
        });
      }
    });
  }

  resetNavigationHistory(path: string) {
    this.history = [path];
  }
}

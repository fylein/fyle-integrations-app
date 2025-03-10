import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { EventsService } from './core/services/common/events.service';
import { QboAuthService } from './core/services/qbo/qbo-core/qbo-auth.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { IframeOrigin, InAppIntegration, IntegrationAppKey } from './core/models/enum/enum.model';
import { SiAuthService } from './core/services/si/si-core/si-auth.service';
import { XeroAuthService } from './core/services/xero/xero-core/xero-auth.service';
import { NetsuiteAuthService } from './core/services/netsuite/netsuite-core/netsuite-auth.service';
import { brandingFeatureConfig } from './branding/branding-config';
import { AuthService } from './core/services/common/auth.service';
import { Router } from '@angular/router';
import { IntegrationsService } from './core/services/common/integrations.service';
import { RedirectUriStorageService } from './core/services/misc/redirect-uri-storage.service';
import { Tokens } from './core/models/misc/integration-tokens-map';
import { IframeOriginStorageService } from './core/services/misc/iframe-origin-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private siAuthService: SiAuthService,
    private qboAuthService: QboAuthService,
    private xeroAuthService: XeroAuthService,
    private nsAuthService: NetsuiteAuthService,
    private router: Router,
    private integrationsService: IntegrationsService,
    private authService: AuthService,
    private redirectUriStorageService: RedirectUriStorageService,
    private iframeOriginStorageService: IframeOriginStorageService
  ) { }

  openInAppIntegration(inAppIntegration: InAppIntegration): void {
    this.router.navigate([this.integrationsService.inAppIntegrationUrlMap[inAppIntegration]]);
  }

  loginAndRedirectToInAppIntegration(redirectUri: string, inAppIntegrationKey: IntegrationAppKey): void {
    const authCode = redirectUri.split('code=')[1].split('&')[0];
    let login$;
    if (inAppIntegrationKey === "INTACCT") {
      login$ = this.siAuthService.loginWithAuthCode(authCode);
    } else if (inAppIntegrationKey === "QBO") {
      login$ = this.qboAuthService.loginWithAuthCode(authCode);
    } else if (inAppIntegrationKey === "XERO") {
      login$ = this.xeroAuthService.login(authCode);
    } else if (inAppIntegrationKey === "NETSUITE") {
      login$ = this.nsAuthService.loginWithAuthCode(authCode);
    } else {
      return;
    }

    login$.subscribe((token: Token) => {
      const tokens: Tokens = {
        'access_token': token.access_token,
        'refresh_token': token.refresh_token
      };

      this.authService.storeTokens(inAppIntegrationKey, tokens);
      const redirect_uri = this.redirectUriStorageService.pop();

      if (redirect_uri) {
        // If the integration iframe was passed a redirect uri from fyle-app before login
        this.router.navigate([redirect_uri]);
      } else {
        this.openInAppIntegration(InAppIntegration[inAppIntegrationKey]);
      }
    });
  }

  private setupLoginWatcher(): void {
    this.eventsService.sageIntacctLogin.subscribe((redirectUri: string) => {
      this.loginAndRedirectToInAppIntegration(redirectUri, "INTACCT");
    });

    this.eventsService.qboLogin.subscribe((redirectUri: string) => {
      this.loginAndRedirectToInAppIntegration(redirectUri, "QBO");
    });

    this.eventsService.xeroLogin.subscribe((redirectUri: string) => {
      this.loginAndRedirectToInAppIntegration(redirectUri, "XERO");
    });

    this.eventsService.netsuiteLogin.subscribe((redirectUri: string) => {
      this.loginAndRedirectToInAppIntegration(redirectUri, "NETSUITE");
    });
  }

  closeToast(): void {
    this.messageService.clear('');
  }

  ngOnInit(): void {
    this.eventsService.receiveEvent();
    if (
      brandingFeatureConfig.loginToAllConnectedApps &&
      this.iframeOriginStorageService.get() === IframeOrigin.ADMIN_DASHBOARD
    ) {
      this.setupLoginWatcher();
    }
    this.primengConfig.ripple = true;
  }
}

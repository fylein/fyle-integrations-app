import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { EventsService } from './core/services/common/events.service';
import { QboAuthService } from './core/services/qbo/qbo-core/qbo-auth.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { MinimalUser } from './core/models/db/user.model';
import { InAppIntegration } from './core/models/enum/enum.model';
import { SiAuthService } from './core/services/si/si-core/si-auth.service';
import { XeroAuthService } from './core/services/xero/xero-core/xero-auth.service';
import { NetsuiteAuthService } from './core/services/netsuite/netsuite-core/netsuite-auth.service';
import { StorageService } from './core/services/common/storage.service';
import { Router } from '@angular/router';
import { IntegrationsService } from './core/services/common/integrations.service';

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
    private storageService: StorageService,
    private router: Router,
    private integrationsService: IntegrationsService
  ) { }

  openInAppIntegration(inAppIntegration: InAppIntegration): void {
    this.router.navigate([this.integrationsService.inAppIntegrationUrlMap[inAppIntegration]]);
  }

  loginAndRedirectToInAppIntegration(redirectUri: string, inAppIntegration: InAppIntegration): void {
    const authCode = redirectUri.split('code=')[1].split('&')[0];
    let login$;
    if (inAppIntegration === InAppIntegration.INTACCT) {
      login$ = this.siAuthService.loginWithAuthCode(authCode);
    } else if (inAppIntegration === InAppIntegration.QBO) {
      login$ = this.qboAuthService.loginWithAuthCode(authCode);
    } else if (inAppIntegration === InAppIntegration.XERO) {
      login$ = this.xeroAuthService.login(authCode);
    } else if (inAppIntegration === InAppIntegration.NETSUITE) {
      login$ = this.nsAuthService.loginWithAuthCode(authCode);
    } else {
      return;
    }

    login$.subscribe((token: Token) => {
      const user: MinimalUser = {
        'email': token.user.email,
        'access_token': token.access_token,
        'refresh_token': token.refresh_token,
        'full_name': token.user.full_name,
        'user_id': token.user.user_id,
        'org_id': token.user.org_id,
        'org_name': token.user.org_name
      };
      this.storageService.set('user', user);
      this.openInAppIntegration(inAppIntegration);
    });
  }

  private setupLoginWatcher(): void {
    this.eventsService.sageIntacctLogin.subscribe((redirectUri: string) => {
      this.loginAndRedirectToInAppIntegration(redirectUri, InAppIntegration.INTACCT);
    });

    this.eventsService.qboLogin.subscribe((redirectUri: string) => {
      this.loginAndRedirectToInAppIntegration(redirectUri, InAppIntegration.QBO);
    });

    this.eventsService.xeroLogin.subscribe((redirectUri: string) => {
      this.loginAndRedirectToInAppIntegration(redirectUri, InAppIntegration.XERO);
    });

    this.eventsService.netsuiteLogin.subscribe((redirectUri: string) => {
      this.loginAndRedirectToInAppIntegration(redirectUri, InAppIntegration.NETSUITE);
    });
  }

  closeToast(): void {
    this.messageService.clear('');
  }

  ngOnInit(): void {
    this.eventsService.receiveEvent();
    this.setupLoginWatcher();
    this.primengConfig.ripple = true;
  }
}

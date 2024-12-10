import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingIntegrationApp, ClickEvent, InAppIntegration, IntegrationView, Page, ThemeOption } from 'src/app/core/models/enum/enum.model';
import { AccountingIntegrationEvent, InAppIntegrationUrlMap, IntegrationCallbackUrl, IntegrationsView } from 'src/app/core/models/integrations/integrations.model';
import { EventsService } from 'src/app/core/services/common/events.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { environment } from 'src/environments/environment';
import { Org } from 'src/app/core/models/org/org.model';
import { SiAuthService } from 'src/app/core/services/si/si-core/si-auth.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { QboAuthService } from 'src/app/core/services/qbo/qbo-core/qbo-auth.service';
import { XeroAuthService } from 'src/app/core/services/xero/xero-core/xero-auth.service';
import { exposeAppConfig } from 'src/app/branding/expose-app-config';
import { NetsuiteAuthService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  IntegrationsView = IntegrationView;

  AccountingIntegrationApp = AccountingIntegrationApp;

  InAppIntegration = InAppIntegration;

  org: Org = this.orgService.getCachedOrg();

  isTravelperkAllowed: boolean = this.org.allow_travelperk;

  readonly exposeC1Apps = brandingFeatureConfig.exposeC1Apps;

  private readonly integrationTabsInitialState: IntegrationsView = {
    [IntegrationView.ACCOUNTING]: false,
    [IntegrationView.HRMS]: false,
    [IntegrationView.ALL]: false,
    [IntegrationView.TRAVEL]: false
  };

  integrationTabs: IntegrationsView = {
    [IntegrationView.ACCOUNTING]: false,
    [IntegrationView.HRMS]: false,
    [IntegrationView.ALL]: true,
    [IntegrationView.TRAVEL]: false
  };

  private readonly integrationCallbackUrlMap: IntegrationCallbackUrl = {
    [AccountingIntegrationApp.NETSUITE]: [`${environment.fyle_app_url}/netsuite`, environment.ns_client_id],
    [AccountingIntegrationApp.QBO]: [`${environment.fyle_app_url}/quickbooks`, environment.qbo_client_id],
    [AccountingIntegrationApp.SAGE_INTACCT]: [`${environment.fyle_app_url}/sage-intacct`, environment.si_client_id],
    [AccountingIntegrationApp.XERO]: [`${environment.fyle_app_url}/xero`, environment.xero_client_id]
  };

  private readonly inAppIntegrationUrlMap: InAppIntegrationUrlMap = {
    [InAppIntegration.BAMBOO_HR]: '/integrations/bamboo_hr/',
    [InAppIntegration.QBD]: '/integrations/qbd/',
    [InAppIntegration.TRAVELPERK]: '/integrations/travelperk/',
    [InAppIntegration.INTACCT]: '/integrations/intacct',
    [InAppIntegration.QBO]: '/integrations/qbo',
    [InAppIntegration.SAGE300]: '/integrations/sage300',
    [InAppIntegration.BUSINESS_CENTRAL]: '/integrations/business_central',
    [InAppIntegration.NETSUITE]: '/integrations/netsuite',
    [InAppIntegration.XERO]: '/integrations/xero',
    [InAppIntegration.QBD_DIRECT]: '/integrations/qbd_direct'
  };

  readonly brandingConfig = brandingConfig;

  readonly isINCluster = this.storageService.get('cluster-domain').includes('in1');

  readonly exposeApps = !this.isINCluster ? exposeAppConfig[brandingConfig.brandId][brandingConfig.envId] : exposeAppConfig[brandingConfig.brandId]['production-1-in'];

  readonly orgsToHideSage300BetaBadge = [
    'or4xcag0tfuk',
    'orC3X89Ku6wE',
    'orUpM1wmNBJX',
    'orOiAVGiOnrh'
  ];

  readonly orgsToHideBusinessCentralBetaBadge = [
    'orvysp2iDQKH',
    'orRuH2BEKRnW'
  ];

  readonly ThemeOption = ThemeOption;

  constructor(
    private eventsService: EventsService,
    private qboAuthService: QboAuthService,
    private xeroAuthService: XeroAuthService,
    private nsAuthService: NetsuiteAuthService,
    private router: Router,
    private siAuthService: SiAuthService,
    private storageService: StorageService,
    private orgService: OrgService
  ) { }


  switchView(clickedView: IntegrationView): void {
    const initialState = Object.create(this.integrationTabsInitialState);

    // Resetting to initial state and setting clicked view to true
    this.integrationTabs = initialState;
    this.integrationTabs[clickedView] = true;
  }

  openAccountingIntegrationApp(accountingIntegrationApp: AccountingIntegrationApp): void {
    const payload = {
      callbackUrl: this.integrationCallbackUrlMap[accountingIntegrationApp][0],
      clientId: this.integrationCallbackUrlMap[accountingIntegrationApp][1]
    };

    this.eventsService.postEvent(payload);
  }

  openInAppIntegration(inAppIntegration: InAppIntegration): void {
    this.router.navigate([this.inAppIntegrationUrlMap[inAppIntegration]]);
  }

  private loginAndRedirectToInAppIntegration(redirectUri: string, inAppIntegration: InAppIntegration): void {
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

  ngOnInit(): void {
    this.setupLoginWatcher();
  }
}

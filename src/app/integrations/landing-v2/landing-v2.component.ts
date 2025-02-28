import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingIntegrationApp, InAppIntegration, IntegrationAppKey, IntegrationView, ThemeOption } from 'src/app/core/models/enum/enum.model';
import { integrationCallbackUrlMap, IntegrationsView } from 'src/app/core/models/integrations/integrations.model';
import { EventsService } from 'src/app/core/services/common/events.service';
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
import { IntegrationsService } from 'src/app/core/services/common/integrations.service';

@Component({
  selector: 'app-landing-v2',
  templateUrl: './landing-v2.component.html',
  styleUrl: './landing-v2.component.scss'
})
export class LandingV2Component implements OnInit {

  IntegrationsView = IntegrationView;

  AccountingIntegrationApp = AccountingIntegrationApp;

  InAppIntegration = InAppIntegration;

  org: Org = this.orgService.getCachedOrg();

  private connectedApps: IntegrationAppKey[];

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

  private readonly accountingIntegrationUrlMap = {
    [AccountingIntegrationApp.NETSUITE]: '/integrations/netsuite',
    [AccountingIntegrationApp.SAGE_INTACCT]: '/integrations/intacct',
    [AccountingIntegrationApp.QBO]: '/integrations/qbo',
    [AccountingIntegrationApp.XERO]: '/integrations/xero'
  };

  readonly brandingConfig = brandingConfig;

  readonly isINCluster = this.storageService.get('cluster-domain')?.includes('in1');

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
    private orgService: OrgService,
    private integrationService: IntegrationsService
  ) { }


  switchView(clickedView: IntegrationView): void {
    const initialState = Object.create(this.integrationTabsInitialState);

    // Resetting to initial state and setting clicked view to true
    this.integrationTabs = initialState;
    this.integrationTabs[clickedView] = true;
  }

  isAppShown(appKey: IntegrationAppKey) {
    // If this app disabled for this org
    if (
      (appKey === 'BUSINESS_CENTRAL' && !this.org.allow_dynamics) ||
      (appKey === 'QBD_DIRECT' && !this.org.allow_qbd_direct_integration) ||
      (appKey === 'TRAVELPERK' && !this.org.allow_travelperk)
    ) {
      return false;
    }

    // If this app allowed and all apps are shown
    if (this.integrationTabs.ALL) {
      return true;
    }

    const allAppKeys = Object.keys(InAppIntegration) as IntegrationAppKey[];

    if (appKey === 'BAMBOO_HR') {
      return this.exposeApps.BAMBOO && this.integrationTabs.HRMS;
    }

    if (appKey === 'TRAVELPERK') {
      return this.exposeApps.TRAVELPERK && this.integrationTabs.TRAVEL;
    }

    // If the app was not BAMBOO_HR or TRAVELPERK, it must be an accounting app
    if (allAppKeys.includes(appKey)) {
      return this.exposeApps[appKey] && this.integrationTabs.ACCOUNTING;
    }

    // TS catch-all (shouln't reach here)
    return false;
  }

  isAppConnected(appKey: IntegrationAppKey) {
    return this.connectedApps?.includes(appKey);
  }

  openAccountingIntegrationApp(accountingIntegrationApp: AccountingIntegrationApp): void {

    // For local dev, we perform auth via loginWithRefreshToken on Fyle login redirect (/auth/redirect)
    // So we can simply redirect to the integration page.
    if (!environment.production) {
      this.router.navigate([this.accountingIntegrationUrlMap[accountingIntegrationApp]]);
      return;
    }

    const payload = {
      callbackUrl: integrationCallbackUrlMap[accountingIntegrationApp][0],
      clientId: integrationCallbackUrlMap[accountingIntegrationApp][1]
    };

    console.log({payload});

    this.eventsService.postEvent(payload);
  }

  openInAppIntegration(inAppIntegration: InAppIntegration): void {
    this.router.navigate([this.integrationService.inAppIntegrationUrlMap[inAppIntegration]]);
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

  private storeConnectedApps() {
    this.integrationService.getIntegrations().subscribe(integrations => {
      const tpaNames = integrations.map(integration => integration.tpa_name);
      const connectedApps = tpaNames
        .map(tpaName =>
          this.integrationService.getIntegrationKey(tpaName)
        )
        .filter(key => key !== null);

      this.connectedApps = connectedApps as IntegrationAppKey[];
    });
  }

  ngOnInit(): void {
    this.setupLoginWatcher();
    this.storeConnectedApps();
  }
}

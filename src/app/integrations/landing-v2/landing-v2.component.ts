import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingIntegrationApp, ClickEvent, InAppIntegration, IntegrationAppKey, IntegrationView, ThemeOption, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { integrationCallbackUrlMap, IntegrationsView } from 'src/app/core/models/integrations/integrations.model';
import { EventsService } from 'src/app/core/services/common/events.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { environment } from 'src/environments/environment';
import { Org } from 'src/app/core/models/org/org.model';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { exposeAppConfig } from 'src/app/branding/expose-app-config';
import { IntegrationsService } from 'src/app/core/services/common/integrations.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
    selector: 'app-landing-v2',
    templateUrl: './landing-v2.component.html',
    styleUrl: './landing-v2.component.scss',
    standalone: false
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

  isLoading: boolean = true;

  private readonly accountingIntegrationUrlMap = {
    [AccountingIntegrationApp.NETSUITE]: '/integrations/netsuite',
    [AccountingIntegrationApp.SAGE_INTACCT]: '/integrations/intacct',
    [AccountingIntegrationApp.QBO]: '/integrations/qbo',
    [AccountingIntegrationApp.XERO]: '/integrations/xero'
  };

  readonly brandingConfig = brandingConfig;

  readonly isINCluster = this.storageService.get('cluster-domain')?.includes('in1');

  readonly exposeApps = !this.isINCluster ? exposeAppConfig[brandingConfig.brandId][brandingConfig.envId] : exposeAppConfig[brandingConfig.brandId]['production-1-in'];

  readonly showQBDIIFIntegration = new Date(this.org.created_at) < new Date('2025-01-17T00:00:00Z');

  readonly ThemeOption = ThemeOption;

  private readonly trackingInAppIntegrationMap = {
    [InAppIntegration.QBD]: TrackingApp.QBD,
    [InAppIntegration.QBD_DIRECT]: TrackingApp.QBD_DIRECT,
    [InAppIntegration.SAGE300]: TrackingApp.SAGE300,
    [InAppIntegration.SAGE50]: TrackingApp.SAGE50,
    [InAppIntegration.BUSINESS_CENTRAL]: TrackingApp.BUSINESS_CENTRAL,
    [InAppIntegration.TRAVELPERK]: TrackingApp.TRAVELPERK,
    [InAppIntegration.BAMBOO_HR]: TrackingApp.BAMBOO_HR,
    [InAppIntegration.INTACCT]: TrackingApp.INTACCT,
    [InAppIntegration.NETSUITE]: TrackingApp.NETSUITE,
    [InAppIntegration.XERO]: TrackingApp.XERO,
    [InAppIntegration.QBO]: TrackingApp.QBO
  };

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private storageService: StorageService,
    private orgService: OrgService,
    private integrationService: IntegrationsService,
    private trackingService: TrackingService
  ) { }


  switchView(clickedView: IntegrationView): void {
    const initialState = Object.create(this.integrationTabsInitialState);

    // Resetting to initial state and setting clicked view to true
    this.integrationTabs = initialState;
    this.integrationTabs[clickedView] = true;
  }

  isAppShown(appKey: IntegrationAppKey) {
    // If this app disabled for this org, or not exposed
    const isAppExposed = this.exposeApps[appKey];
    if (
      (appKey === 'BUSINESS_CENTRAL' && !this.org.allow_dynamics) ||
      (appKey === 'QBD_DIRECT' && !this.org.allow_qbd_direct_integration) ||
      (appKey === 'TRAVELPERK' && !this.org.allow_travelperk) ||
      (appKey === 'BAMBOO_HR' && !this.org.allow_bamboohr) ||
      (appKey === 'QBD' && !this.showQBDIIFIntegration) ||
      !isAppExposed
    ) {
      return false;
    }

    // If this app enabled & exposed, and all apps are shown
    if (this.integrationTabs.ALL) {
      return true;
    }

    if (appKey === 'BAMBOO_HR') {
      return this.integrationTabs.HRMS;
    }

    if (appKey === 'TRAVELPERK') {
      return this.integrationTabs.TRAVEL;
    }

    // If the app was not BAMBOO_HR or TRAVELPERK, it must be an accounting app
    const allAppKeys = Object.keys(InAppIntegration) as IntegrationAppKey[];
    if (allAppKeys.includes(appKey)) {
      return this.integrationTabs.ACCOUNTING;
    }

    // TS catch-all (shouldn't reach here)
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

    this.eventsService.postEvent(payload);
  }

  openInAppIntegration(inAppIntegration: InAppIntegration): void {
    this.trackingService.onClickEvent(this.trackingInAppIntegrationMap[inAppIntegration], ClickEvent.OPEN_INTEGRATION);
    this.router.navigate([this.integrationService.inAppIntegrationUrlMap[inAppIntegration]]);
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
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.storeConnectedApps();
    this.trackingService.onLandingV2Open();
  }
}

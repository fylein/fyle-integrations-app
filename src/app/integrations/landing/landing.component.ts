import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingIntegrationApp, ClickEvent, InAppIntegration, IntegrationView, Page } from 'src/app/core/models/enum/enum.model';
import { AccountingIntegrationEvent, InAppIntegrationUrlMap, IntegrationCallbackUrl, IntegrationsView } from 'src/app/core/models/integrations/integrations.model';
import { EXPOSE_INTACCT_NEW_APP, EventsService } from 'src/app/core/services/common/events.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { environment } from 'src/environments/environment';
import { Org } from 'src/app/core/models/org/org.model';
import { SiAuthService } from 'src/app/core/services/si/si-core/si-auth.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { brandingConfig } from 'src/app/branding/branding-config';

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

  isGustoAllowed: boolean = this.org.allow_gusto;

  exposeIntacctNewApp: boolean = EXPOSE_INTACCT_NEW_APP;

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
    [AccountingIntegrationApp.NETSUITE]: [environment.ns_callback_url, environment.ns_client_id],
    [AccountingIntegrationApp.QBO]: [environment.qbo_callback_url, environment.qbo_client_id],
    [AccountingIntegrationApp.SAGE_INTACCT]: [environment.si_callback_url, environment.si_client_id],
    [AccountingIntegrationApp.XERO]: [environment.xero_callback_url, environment.xero_client_id]
  };

  private readonly inAppIntegrationUrlMap: InAppIntegrationUrlMap = {
    [InAppIntegration.BAMBOO_HR]: '/integrations/bamboo_hr/',
    [InAppIntegration.QBD]: '/integrations/qbd/',
    [InAppIntegration.TRAVELPERK]: '/integrations/travelperk/',
    [InAppIntegration.GUSTO]: '/integrations/gusto/',
    [InAppIntegration.INTACCT]: '/integrations/intacct',
    [InAppIntegration.SAGE300]: '/integrations/sage300',
    [InAppIntegration.BUSINESS_CENTRAL]: '/integrations/business_central'
  };

  private readonly accountingIntegrationEventMap: AccountingIntegrationEvent = {
    [AccountingIntegrationApp.NETSUITE]: ClickEvent.OPEN_NETSUITE_INTEGRATION,
    [AccountingIntegrationApp.QBO]: ClickEvent.OPEN_QBO_INTEGRATION,
    [AccountingIntegrationApp.SAGE_INTACCT]: ClickEvent.OPEN_SAGE_INTACCT_INTEGRATION,
    [AccountingIntegrationApp.XERO]: ClickEvent.OPEN_XERO_INTEGRATION
  };

  private readonly sessionStartTime = new Date();

  readonly brandingConfig = brandingConfig;

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private siAuthService: SiAuthService,
    private storageService: StorageService,
    private trackingService: TrackingService,
    private orgService: OrgService
  ) { }


  switchView(clickedView: IntegrationView): void {
    const initialState = Object.create(this.integrationTabsInitialState);
    this.trackingService.onClickEvent(ClickEvent.INTEGRATION_TABS);

    // Resetting to initial state and setting clicked view to true
    this.integrationTabs = initialState;
    this.integrationTabs[clickedView] = true;
  }

  openAccountingIntegrationApp(accountingIntegrationApp: AccountingIntegrationApp): void {
    this.trackingService.trackTimeSpent(Page.LANDING, this.sessionStartTime);
    this.trackingService.onClickEvent(this.accountingIntegrationEventMap[accountingIntegrationApp]);

    const payload = {
      callbackUrl: this.integrationCallbackUrlMap[accountingIntegrationApp][0],
      clientId: this.integrationCallbackUrlMap[accountingIntegrationApp][1]
    };

    this.eventsService.postEvent(payload);
  }

  openInAppIntegration(inAppIntegration: InAppIntegration): void {
    this.trackingService.trackTimeSpent(Page.LANDING, this.sessionStartTime);
    this.router.navigate([this.inAppIntegrationUrlMap[inAppIntegration]]);
  }

  private setupLoginWatcher(): void {
    const intacctLogin$ = this.eventsService.sageIntacctLogin.subscribe((redirectUri: string) => {
      const authCode = redirectUri.split('code=')[1].split('&')[0];
      this.siAuthService.loginWithAuthCode(authCode).subscribe((token: Token) => {
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
        intacctLogin$.unsubscribe();
        this.openInAppIntegration(InAppIntegration.INTACCT);
      });
    });
  }

  ngOnInit(): void {
    this.setupLoginWatcher();
  }
}

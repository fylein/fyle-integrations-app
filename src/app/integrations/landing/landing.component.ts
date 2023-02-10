import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingIntegrationApp, ClickEvent, InAppIntegration, IntegrationView, Page } from 'src/app/core/models/enum/enum.model';
import { AccountingIntegrationEvent, InAppIntegrationUrlMap, IntegrationCallbackUrl, IntegrationsView } from 'src/app/core/models/integrations/integrations.model';
import { EventsService } from 'src/app/core/services/core/events.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  IntegrationsView = IntegrationView;

  AccountingIntegrationApp = AccountingIntegrationApp;

  InAppIntegration = InAppIntegration;

  private readonly integrationTabsInitialState: IntegrationsView = {
    [IntegrationView.ACCOUNTING]: false,
    [IntegrationView.HRMS]: false,
    [IntegrationView.ALL]: false
  };

  integrationTabs: IntegrationsView = {
    [IntegrationView.ACCOUNTING]: false,
    [IntegrationView.HRMS]: false,
    [IntegrationView.ALL]: true
  };

  private readonly integrationCallbackUrlMap: IntegrationCallbackUrl = {
    [AccountingIntegrationApp.NETSUITE]: [environment.ns_callback_url, environment.ns_client_id],
    [AccountingIntegrationApp.QBO]: [environment.qbo_callback_url, environment.qbo_client_id],
    [AccountingIntegrationApp.SAGE_INTACCT]: [environment.si_callback_url, environment.si_client_id],
    [AccountingIntegrationApp.XERO]: [environment.xero_callback_url, environment.xero_client_id]
  };

  private readonly inAppIntegrationUrlMap: InAppIntegrationUrlMap = {
    [InAppIntegration.BAMBOO_HR]: '/integrations/bamboo_hr/',
    [InAppIntegration.QBD]: '/integrations/qbd/'
  };

  private readonly accountingIntegrationEventMap: AccountingIntegrationEvent = {
    [AccountingIntegrationApp.NETSUITE]: ClickEvent.OPEN_NETSUITE_INTEGRATION,
    [AccountingIntegrationApp.QBO]: ClickEvent.OPEN_QBO_INTEGRATION,
    [AccountingIntegrationApp.SAGE_INTACCT]: ClickEvent.OPEN_SAGE_INTACCT_INTEGRATION,
    [AccountingIntegrationApp.XERO]: ClickEvent.OPEN_XERO_INTEGRATION
  };

  private readonly sessionStartTime = new Date();

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private trackingService: TrackingService
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
    this.eventsService.postEvent(this.integrationCallbackUrlMap[accountingIntegrationApp][0], this.integrationCallbackUrlMap[accountingIntegrationApp][1]);
  }

  openInAppIntegration(inAppIntegration: InAppIntegration): void {
    this.trackingService.trackTimeSpent(Page.LANDING, this.sessionStartTime);
    this.router.navigate([this.inAppIntegrationUrlMap[inAppIntegration]]);
  }

  ngOnInit(): void {
  }

}

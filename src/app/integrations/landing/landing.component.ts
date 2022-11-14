import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingIntegrationApp, InAppIntegration, IntegrationView } from 'src/app/core/models/enum/enum.model';
import { InAppIntegrationUrlMap, IntegrationCallbackUrl, IntegrationsView } from 'src/app/core/models/integrations/integrations.model';
import { EventsService } from 'src/app/core/services/core/events.service';
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
    [InAppIntegration.BAMBOO_HR]: '/integrations/bamboo_hr/'
  };

  constructor(
    private eventsService: EventsService,
    private router: Router
  ) { }

  switchView(clickedView: IntegrationView): void {
    const initialState = Object.create(this.integrationTabsInitialState);

    // Resetting to initial state and setting clicked view to true
    this.integrationTabs = initialState;
    this.integrationTabs[clickedView] = true;
  }

  openAccountingIntegrationApp(accountingIntegrationApp: AccountingIntegrationApp): void {
    this.eventsService.postEvent(this.integrationCallbackUrlMap[accountingIntegrationApp][0], this.integrationCallbackUrlMap[accountingIntegrationApp][1]);
  }

  openInAppIntegration(inAppIntegration: InAppIntegration): void {
    this.router.navigate([this.inAppIntegrationUrlMap[inAppIntegration]]);
  }

  ngOnInit(): void {
  }

}

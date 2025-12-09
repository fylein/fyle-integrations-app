import { Injectable } from '@angular/core';
import { AppUrl, InAppIntegration, IntegrationAppKey } from '../../models/enum/enum.model';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs';
import { InAppIntegrationUrlMap, Integration } from '../../models/integrations/integrations.model';
import { Cacheable } from 'ts-cacheable';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  constructor(
    private apiService: ApiService,
    private helper: HelperService,
    private router: Router,
  ) {}

  readonly tpaNameToIntegrationKeyMap = {
    'Fyle Netsuite Integration': 'NETSUITE',
    'Fyle Sage Intacct Integration': 'INTACCT',
    'Fyle Quickbooks Integration': 'QBO',
    'Fyle Xero Integration': 'XERO',
    'Fyle Quickbooks Desktop (IIF) Integration': 'QBD',
    'Fyle Quickbooks Desktop Integration': 'QBD_DIRECT',
    'Fyle Sage 300 Integration': 'SAGE300',
    'Fyle Business Central Integration': 'BUSINESS_CENTRAL',
    'Fyle TravelPerk Integration': 'TRAVELPERK',
    'Fyle BambooHR Integration': 'BAMBOO_HR',
    'Sage File Export Integration': 'SAGE50',
  } satisfies Record<string, IntegrationAppKey>;

  readonly inAppIntegrationUrlMap: InAppIntegrationUrlMap = {
    [InAppIntegration.BAMBOO_HR]: '/integrations/bamboo_hr/',
    [InAppIntegration.QBD]: '/integrations/qbd/',
    [InAppIntegration.TRAVELPERK]: '/integrations/travelperk/',
    [InAppIntegration.INTACCT]: '/integrations/intacct',
    [InAppIntegration.QBO]: '/integrations/qbo',
    [InAppIntegration.SAGE300]: '/integrations/sage300',
    [InAppIntegration.BUSINESS_CENTRAL]: '/integrations/business_central',
    [InAppIntegration.NETSUITE]: '/integrations/netsuite',
    [InAppIntegration.XERO]: '/integrations/xero',
    [InAppIntegration.QBD_DIRECT]: '/integrations/qbd_direct',
    [InAppIntegration.SAGE50]: '/integrations/sage50',
  };

  getIntegrationKey(tpaName: string): IntegrationAppKey | null {
    if (this.tpaNameToIntegrationKeyMap.hasOwnProperty(tpaName)) {
      return this.tpaNameToIntegrationKeyMap[tpaName as keyof typeof this.tpaNameToIntegrationKeyMap];
    }
    return null;
  }

  getIntegrationName(tpaName: string) {
    const integrationKey = this.getIntegrationKey(tpaName);
    return integrationKey && InAppIntegration[integrationKey];
  }

  navigateToIntegration(inAppIntegration: InAppIntegration) {
    this.router.navigate([this.inAppIntegrationUrlMap[inAppIntegration]]);
  }

  @Cacheable()
  getIntegrations(): Observable<Integration[]> {
    // Store the existing base API URL
    const previousBaseApiUrl = this.apiService.getBaseApiURL();

    // Set the base API URL to the integrations URL
    this.helper.setBaseApiURL(AppUrl.INTEGRATION);
    const integrationsObservable = this.apiService.get(`/integrations/`, {});

    // Reset the base API URL to the previous one, so that the following requests are not affected
    this.apiService.setBaseApiURL(previousBaseApiUrl);
    return integrationsObservable;
  }
}

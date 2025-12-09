import {
  AccountingIntegrationApp,
  AppUrl,
  ClickEvent,
  InAppIntegration,
  IntegrationAppKey,
  IntegrationView,
} from '../enum/enum.model';
import { environment } from 'src/environments/environment';

export type Integration = {
  id: number;
  org_id: string;
  org_name: string;
  tpa_id: string;
  tpa_name: string;
  type: string;
  is_active: boolean;
  is_beta: boolean;
};

export type IntegrationsView = {
  [IntegrationView.ACCOUNTING]: boolean;
  [IntegrationView.ALL]: boolean;
  [IntegrationView.HRMS]: boolean;
  [IntegrationView.TRAVEL]: boolean;
};

export type IntegrationCallbackUrl = {
  [AccountingIntegrationApp.NETSUITE]: [string, string];
  [AccountingIntegrationApp.QBO]: [string, string];
  [AccountingIntegrationApp.SAGE_INTACCT]: [string, string];
  [AccountingIntegrationApp.XERO]: [string, string];
};

export type AccountingIntegrationEvent = {
  [AccountingIntegrationApp.NETSUITE]: ClickEvent;
  [AccountingIntegrationApp.QBO]: ClickEvent;
  [AccountingIntegrationApp.SAGE_INTACCT]: ClickEvent;
  [AccountingIntegrationApp.XERO]: ClickEvent;
};

export type InAppIntegrationUrlMap = {
  [InAppIntegration.BAMBOO_HR]: string;
  [InAppIntegration.QBD]: string;
  [InAppIntegration.TRAVELPERK]: string;
  [InAppIntegration.INTACCT]: string;
  [InAppIntegration.QBO]: string;
  [InAppIntegration.SAGE300]: string;
  [InAppIntegration.BUSINESS_CENTRAL]: string;
  [InAppIntegration.NETSUITE]: string;
  [InAppIntegration.XERO]: string;
  [InAppIntegration.QBD_DIRECT]: string;
  [InAppIntegration.SAGE50]: string;
};

export type AppUrlMap = {
  [AppUrl.BAMBOO_HR]: string | null;
  [AppUrl.QBD]: string;
  [AppUrl.TRAVELPERK]: string | null;
  [AppUrl.INTACCT]: string;
  [AppUrl.SAGE300]: string;
  [AppUrl.INTEGRATION]: string;
  [AppUrl.BUSINESS_CENTRAL]: string;
  [AppUrl.QBO]: string;
  [AppUrl.NETSUITE]: string;
  [AppUrl.XERO]: string;
  [AppUrl.QBD_DIRECT]: string;
  [AppUrl.SAGE50]: string;
};

export const integrationCallbackUrlMap: IntegrationCallbackUrl = {
  [AccountingIntegrationApp.NETSUITE]: [`${environment.fyle_app_url}/netsuite`, environment.ns_client_id],
  [AccountingIntegrationApp.QBO]: [`${environment.fyle_app_url}/quickbooks`, environment.qbo_client_id],
  [AccountingIntegrationApp.SAGE_INTACCT]: [`${environment.fyle_app_url}/sage-intacct`, environment.si_client_id],
  [AccountingIntegrationApp.XERO]: [`${environment.fyle_app_url}/xero`, environment.xero_client_id],
};

export const appKeyToAccountingIntegrationApp: Partial<Record<IntegrationAppKey, AccountingIntegrationApp>> = {
  NETSUITE: AccountingIntegrationApp.NETSUITE,
  INTACCT: AccountingIntegrationApp.SAGE_INTACCT,
  QBO: AccountingIntegrationApp.QBO,
  XERO: AccountingIntegrationApp.XERO,
};

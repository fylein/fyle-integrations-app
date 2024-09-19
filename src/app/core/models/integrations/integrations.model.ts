import type { AccountingIntegrationApp, AppUrl, ClickEvent, InAppIntegration, IntegrationView } from "../enum/enum.model";

export interface IntegrationsView {
    [IntegrationView.ACCOUNTING]: boolean,
    [IntegrationView.ALL]: boolean,
    [IntegrationView.HRMS]: boolean,
    [IntegrationView.TRAVEL]: boolean
}

export interface IntegrationCallbackUrl {
    [AccountingIntegrationApp.NETSUITE]: [string, string],
    [AccountingIntegrationApp.QBO]: [string, string],
    [AccountingIntegrationApp.SAGE_INTACCT]: [string, string],
    [AccountingIntegrationApp.XERO]: [string, string]
}

export interface AccountingIntegrationEvent {
    [AccountingIntegrationApp.NETSUITE]: ClickEvent,
    [AccountingIntegrationApp.QBO]: ClickEvent,
    [AccountingIntegrationApp.SAGE_INTACCT]: ClickEvent,
    [AccountingIntegrationApp.XERO]: ClickEvent
}

export interface InAppIntegrationUrlMap {
    [InAppIntegration.BAMBOO_HR]: string,
    [InAppIntegration.QBD]: string,
    [InAppIntegration.TRAVELPERK]: string,
    [InAppIntegration.INTACCT]: string,
    [InAppIntegration.QBO]: string,
    [InAppIntegration.SAGE300]: string,
    [InAppIntegration.BUSINESS_CENTRAL]: string,
    [InAppIntegration.NETSUITE]: string,
    [InAppIntegration.XERO]: string
}

export interface AppUrlMap {
    [AppUrl.BAMBOO_HR]: string | null,
    [AppUrl.QBD]: string,
    [AppUrl.TRAVELPERK]: string | null,
    [AppUrl.INTACCT]: string,
    [AppUrl.SAGE300]: string,
    [AppUrl.INTEGRATION]: string,
    [AppUrl.BUSINESS_CENTRAL]: string
    [AppUrl.QBO]: string
    [AppUrl.NETSUITE]: string
    [AppUrl.XERO]: string
}

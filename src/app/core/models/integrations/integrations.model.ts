import { AccountingIntegrationApp, AppUrl, ClickEvent, InAppIntegration, IntegrationView } from "../enum/enum.model";

export type IntegrationsView = {
    [IntegrationView.ACCOUNTING]: boolean,
    [IntegrationView.ALL]: boolean,
    [IntegrationView.HRMS]: boolean,
    [IntegrationView.TRAVEL]: boolean
}

export type IntegrationCallbackUrl = {
    [AccountingIntegrationApp.NETSUITE]: [string, string],
    [AccountingIntegrationApp.QBO]: [string, string],
    [AccountingIntegrationApp.SAGE_INTACCT]: [string, string],
    [AccountingIntegrationApp.XERO]: [string, string]
}

export type AccountingIntegrationEvent = {
    [AccountingIntegrationApp.NETSUITE]: ClickEvent,
    [AccountingIntegrationApp.QBO]: ClickEvent,
    [AccountingIntegrationApp.SAGE_INTACCT]: ClickEvent,
    [AccountingIntegrationApp.XERO]: ClickEvent
}

export type InAppIntegrationUrlMap = {
    [InAppIntegration.BAMBOO_HR]: string,
    [InAppIntegration.QBD]: string,
    [InAppIntegration.TRAVELPERK]: string,
    [InAppIntegration.GUSTO]: string,
    [InAppIntegration.INTACCT]: string,
    [InAppIntegration.QBO]: string,
    [InAppIntegration.SAGE300]: string,
    [InAppIntegration.BUSINESS_CENTRAL]: string
}

export type AppUrlMap = {
    [AppUrl.BAMBOO_HR]: string | null,
    [AppUrl.QBD]: string,
    [AppUrl.TRAVELPERK]: string | null,
    [AppUrl.GUSTO]: string | null,
    [AppUrl.INTACCT]: string,
    [AppUrl.SAGE300]: string,
    [AppUrl.INTEGRATION]: string,
    [AppUrl.BUSINESS_CENTRAL]: string
    [AppUrl.QBO]: string
}
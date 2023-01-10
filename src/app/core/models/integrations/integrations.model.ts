import { AccountingIntegrationApp, ClickEvent, InAppIntegration, IntegrationView } from "../enum/enum.model";

export type IntegrationsView = {
    [IntegrationView.ACCOUNTING]: boolean,
    [IntegrationView.ALL]: boolean,
    [IntegrationView.HRMS]: boolean
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
}

import { AccountingIntegrationApp, IntegrationView } from "../enum/enum.model";

export type IntegrationsView = {
    [IntegrationView.ACCOUNTING]: boolean,
    [IntegrationView.ALL]: boolean
}

export type IntegrationCallbackUrl = {
    [AccountingIntegrationApp.NETSUITE]: [string, string],
    [AccountingIntegrationApp.QBO]: [string, string],
    [AccountingIntegrationApp.SAGE_INTACCT]: [string, string],
    [AccountingIntegrationApp.XERO]: [string, string]
}

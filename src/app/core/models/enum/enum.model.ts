export enum IntegrationView {
    ALL = 'ALL',
    ACCOUNTING = 'ACCOUNTING',
    HRMS = 'HRMS'
}

export enum AccountingIntegrationApp {
    QBO = 'QBO',
    NETSUITE = 'NetSuite',
    SAGE_INTACCT = 'Sage Intacct',
    XERO = 'Xero'
}

export enum InAppIntegration {
    BAMBOO_HR = 'Bamboo HR',
    QBD = 'QuickBooks Desktop'
}

export enum RedirectLink {
    BAMBOO_HR = 'https://help.fylehq.com/en/articles/6845034-fyle-bamboo-hr-integration',
    QBD = 'https://help.fylehq.com/en/articles/6845034-fyle-bamboo-hr-integration'
}

export enum ToastSeverity {
    SUCCESS = 'success',
    ERROR = 'error'
}

export enum Page {
    LANDING = 'Landing',
    BAMBOO_HR_LANDING = 'Bamboo HR Landing',
    CONNECT_BAMBOO_HR = 'Connect Bamboo HR',
    CONFIGURE_BAMBOO_HR = 'Bamboo HR Configuration',
    QBD_LANDING = 'QuickBooks Desktop Landing',
    CONNECT_QBD = 'Connect QuickBooks Desktop',
    CONFIGURE_QBD = 'QuickBooks Desktop Configuration',
}

export enum ClickEvent {
    OPEN_QBO_INTEGRATION = 'Open QBO Integration',
    OPEN_NETSUITE_INTEGRATION = 'Open NetSuite Integration',
    OPEN_SAGE_INTACCT_INTEGRATION = 'Open Sage Intacct Integration',
    OPEN_XERO_INTEGRATION = 'Open Xero Integration',
    OPEN_BAMBOO_HR_INTEGRATION = 'Open Bamboo HR Integration',
    OPEN_QBD_INTEGRATION = 'Open Bamboo HR Integration',
    INTEGRATION_TABS = 'Integration Tabs',
    CONNECT_BAMBOO_HR = 'Connect Bamboo HR',
    CONFIGURE_BAMBOO_HR = 'Configure Bamboo HR',
    DISCONNECT_BAMBOO_HR = 'Disconnect Bamboo HR',
    CONNECT_QBD = 'Connect Bamboo HR',
    CONFIGURE_QBD = 'Configure Bamboo HR',
    DISCONNECT_QBD = 'Disconnect Bamboo HR',
    COPY_SUPPORT_EMAIL = 'Copy Support Email',
    SYNC_BAMBOO_HR_EMPLOYEES = 'Sync Bamboo HR Employees',
    ADD_BAMBOO_HR_EMAIL_MANUALLY = 'Add Bamboo HR Email Manually'
}

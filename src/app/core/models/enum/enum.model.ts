export enum IntegrationView {
    ALL = 'ALL',
    ACCOUNTING = 'ACCOUNTING',
    HRMS = 'HRMS',
    TRAVEL = 'TRAVEL'
}

export enum AccountingIntegrationApp {
    QBO = 'QBO',
    NETSUITE = 'NetSuite',
    SAGE_INTACCT = 'Sage Intacct',
    XERO = 'Xero'
}

export enum InAppIntegration {
    BAMBOO_HR = 'Bamboo HR',
    QBD = 'QuickBooks Desktop',
    TRAVELPERK = 'TravelPerk',
    GUSTO = 'Gusto'
}

export enum RedirectLink {
    BAMBOO_HR = 'https://help.fylehq.com/en/articles/6845034-fyle-bamboo-hr-integration',
    QBD = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle#quickbooks-desktop',
    // TODO: Change the link to the actual help article
    TRAVELPERK = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
    GUSTO = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle'
}

export enum ToastSeverity {
    SUCCESS = 'success',
    ERROR = 'error'
}

export enum UpdateEvent {
  CONNECT_QBD = 'Connect QuickBooks Desktop',
  EXPORT_SETTING_QBD = 'Export Settings QBD',
  FIELD_MAPPING_QBD = 'Field Mappings QBD',
  ADVANCED_SETTINGS_QBD = 'Advanced Settings QBD'
}

export enum AppName {
  BAMBOO_HR = 'BambooHR',
  QBD = 'QuickBooks Desktop',
  TRAVELPERK = 'Travelperk',
  GUSTO = 'Gusto'
}

export enum Page {
  LANDING = 'Landing',
  BAMBOO_HR_LANDING = 'Bamboo HR Landing',
  CONNECT_BAMBOO_HR = 'Connect Bamboo HR',
  CONFIGURE_BAMBOO_HR = 'Bamboo HR Configuration',
  GUSTO_LANDING = 'Gusto Landing',
  CONFIGURE_GUSTO = 'Gusto Configuration',
  QBD_LANDING = 'QuickBooks Desktop Landing',
  CONNECT_QBD = 'Connect QuickBooks Desktop',
  EXPORT_SETTING_QBD = 'Export Settings QBD',
  FIELD_MAPPING_QBD = 'Field Mappings QBD',
  ADVANCED_SETTINGS_QBD = 'Advanced Settings QBD',
}
export enum ClickEvent {
  OPEN_QBO_INTEGRATION = 'Open QBO Integration',
  OPEN_NETSUITE_INTEGRATION = 'Open NetSuite Integration',
  OPEN_SAGE_INTACCT_INTEGRATION = 'Open Sage Intacct Integration',
  OPEN_XERO_INTEGRATION = 'Open Xero Integration',
  OPEN_BAMBOO_HR_INTEGRATION = 'Open Bamboo HR Integration',
  OPEN_QBD_INTEGRATION = 'Open QBD Integration',
  OPEN_GUSTO_INTEGRATION = 'Open Gusto Integration',
  INTEGRATION_TABS = 'Integration Tabs',
  CONNECT_BAMBOO_HR = 'Connect Bamboo HR',
  CONFIGURE_BAMBOO_HR = 'Configure Bamboo HR',
  DISCONNECT_BAMBOO_HR = 'Disconnect Bamboo HR',
  CONNECT_GUSTO = 'Connect Gusto',
  CONFIGURE_GUSTO = 'Configure Gusto',
  DISCONNECT_GUSTO = 'Disconnect Gusto',
  SYNC_GUSTO_EMPLOYEES = 'Sync Gusto Employees',
  CONNECT_QBD = 'Connect QBD',
  COPY_SUPPORT_EMAIL = 'Copy Support Email',
  SYNC_BAMBOO_HR_EMPLOYEES = 'Sync Bamboo HR Employees',
  ADD_BAMBOO_HR_EMAIL_MANUALLY = 'Add Bamboo HR Email Manually',
  ADD_EMAIL_MANUALLY = 'Add Email Manually',
  QBD_EXPORT = 'Export IIF files'
}

export enum ProgressPhase {
  ONBOARDING = 'Onboarding',
  POST_ONBOARDING = 'Post Onboarding'
}

export enum QBDOnboardingState {
    CONNECTION = 'CONNECTION',
    EXPORT_SETTINGS = 'EXPORT_SETTINGS',
    FIELD_MAPPINGS = 'FIELD_MAPPINGS',
    ADVANCED_SETTINGS = 'ADVANCED_SETTINGS',
    COMPLETE = 'COMPLETE'
  }

  export enum ConfigurationCta {
    SAVE = 'Save',
    SAVE_AND_CONTINUE = 'Save and Continue',
    CONTINUE = 'Continue',
    SAVING = 'Saving'
  }

  export enum QBDReimbursableExpensesObject {
    BILL = 'BILL',
    JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  }

  export enum QBDCorporateCreditCardExpensesObject {
    CREDIT_CARD_PURCHASE = 'CREDIT_CARD_PURCHASE',
    JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  }

  export enum QBDExpenseState {
    PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
    PAID = 'PAID'
  }

  export enum QBDCCCExpenseState {
    PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
    PAID = 'PAID',
    APPROVED = 'APPROVED'
  }

  export enum QBDExpenseGroupedBy {
    EXPENSE = 'EXPENSE',
    REPORT = 'REPORT'
  }

  export enum QBDExportDateType {
    LAST_SPENT_AT = 'last_spent_at',
    SPENT_AT = 'spent_at',
    POSTED_AT = 'posted_at'
  }

  export enum QBDEntity {
    EMPLOYEE = 'EMPLOYEE',
    VENDOR = 'VENDOR'
  }

  export enum QBDScheduleFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY'
  }
  export enum QBDFyleField {
    PROJECT = 'PROJECT',
    COST_CENTER = 'COST_CENTER'
  }

  export enum QBDAccountingExportsState {
    COMPLETE = 'COMPLETE',
    ENQUEUED = 'ENQUEUED',
    IN_PROGRESS = 'IN_PROGRESS',
  }

  export enum QBDAccountingExportsType {
    EXPORT_BILLS = 'EXPORT_BILLS',
    REIMBURSABLE = 'REIMBURSABLE',
    CREDIT_CARD = 'CREDIT_CARD',
    EXPORT_CREDIT_CARD_PURCHASES = 'EXPORT_CREDIT_CARD_PURCHASES',
    EXPORT_JOURNALS = 'EXPORT_JOURNALS'
  }
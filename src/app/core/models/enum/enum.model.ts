export enum IntegrationView {
  ALL = 'ALL',
  ACCOUNTING = 'ACCOUNTING',
  HRMS = 'HRMS',
  TRAVEL = 'TRAVEL'
}

export enum IntacctCategoryDestination {
  EXPENSE_TYPE = 'EXPENSE_TYPE',
  ACCOUNT = 'GL_ACCOUNT'
}

export enum AutoMapEmployeeOptions {
  EMAIL = 'EMAIL',
  NAME = 'NAME',
  EMPLOYEE_CODE = 'EMPLOYEE_CODE'
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
  GUSTO = 'Gusto',
  INTACCT = 'Sage Intacct'
}

export enum RedirectLink {
  BAMBOO_HR = 'https://help.fylehq.com/en/articles/6845034-fyle-bamboo-hr-integration',
  QBD = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle#quickbooks-desktop',
  // TODO: Change the link to the actual help article
  INTACCT = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
  TRAVELPERK = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
  GUSTO = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle'
}

export enum EmbedVideoLink {
  INTACCT = 'https://www.youtube.com/embed/b63lS2DG5j4'
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

export enum IntacctUpdateEvent {
  CONNECT_INTACCT = 'Connect Sage Intacct',
  EXPORT_SETTING_INTACCT = 'Export Settings Intacct',
  IMPORT_SETTINGS_INTACCT = 'Import Settings Intacct',
  ADVANCED_SETTINGS_INTACCT= 'Advanced Settings Intacct',
}

export enum AppName {
  BAMBOO_HR = 'BambooHR',
  QBD = 'QuickBooks Desktop',
  TRAVELPERK = 'Travelperk',
  GUSTO = 'Gusto',
  INTACCT = 'Sage Intacct'
}

export enum Page {
  LANDING = 'Landing',
  BAMBOO_HR_LANDING = 'Bamboo HR Landing',
  CONNECT_BAMBOO_HR = 'Connect Bamboo HR',
  CONFIGURE_BAMBOO_HR = 'Bamboo HR Configuration',
  GUSTO_LANDING = 'Gusto Landing',
  CONFIGURE_GUSTO = 'Gusto Configuration',
  QBD_LANDING = 'QuickBooks Desktop Landing',
  INTACCT_LANDING = 'Sage Intacct Landing',
  CONNECT_QBD = 'Connect QuickBooks Desktop',
  CONNECT_INTACCT = 'Connect Sage Intacct',
  EXPORT_SETTING_QBD = 'Export Settings QBD',
  EXPORT_SETTING_INTACCT = 'Export Settings Intacct',
  IMPORT_SETTINGS_INTACCT = 'Import Settings Intacct',
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
  ADD_CUSTOM_FIELD = 'Add Custom Field',
  QBD_EXPORT = 'Export IIF files',
  CONNECT_INTACCT  = 'Connect Sage Intacct',
  PREVIEW_INTACCT_EXPORT = 'Preview Sage Intacct Export',
  INTACCT_EXPORT = 'Export Sage Intacct'
}

export enum ProgressPhase {
  ONBOARDING = 'Onboarding',
  POST_ONBOARDING = 'Post Onboarding'
}

export enum IntacctOnboardingState {
  CONNECTION = 'CONNECTION',
  LOCATION_ENTITY = 'LOCATION_ENTITY_MAPPINGS',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_CONFIGURATION = 'ADVANCED_CONFIGURATION',
  COMPLETE = 'COMPLETE'
}

export enum IntacctField {
  LOCATION_ENTITY = 'LOCATION_ENTITY',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_SETTINGS = 'ADVANCED_SETTINGS'
}

export enum IntacctReimbursableExpensesObject {
  BILL = 'BILL',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  EXPENSE_REPORT = 'EXPENSE_REPORT'
}

export enum CorporateCreditCardExpensesObject {
  BILL = 'BILL',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  EXPENSE_REPORT = 'EXPENSE_REPORT',
  CHARGE_CARD_TRANSACTION = 'CHARGE_CARD_TRANSACTION'
}

export enum ExpenseState {
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  PAID = 'PAID'
}

export enum CCCExpenseState {
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  PAID = 'PAID',
  APPROVED = 'APPROVED'
}

export enum ExpenseGroupedBy {
  EXPENSE = 'EXPENSE',
  REPORT = 'REPORT',
  PAYMENT = 'PAYMENT'
}

export enum ExportDateType {
  LAST_SPENT_AT = 'last_spent_at',
  SPENT_AT = 'spent_at',
  POSTED_AT = 'posted_at',
  CURRENT_DATE = 'current_date',
  VERIFIED_DATE = 'verified_at',
  APPROVAL_DATE = 'approved_at',
}

export enum FyleField {
  EMPLOYEE = 'EMPLOYEE',
  VENDOR = 'VENDOR'
}

export enum ExpenseGroupingFieldOption {
  CLAIM_NUMBER = 'claim_number',
  SETTLEMENT_ID = 'settlement_id',
  EXPENSE_ID = 'expense_id'
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
  SAVING = 'Saving',
  SYNCING = 'Syncing'
  }

  export enum QBDReimbursableExpensesObject {
  BILL = 'BILL',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  }

  export enum QBDCorporateCreditCardExpensesObject {
  CREDIT_CARD_PURCHASE = 'CREDIT_CARD_PURCHASE',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
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

  export enum PaymentSyncDirection {
    FYLE_TO_INTACCT = 'fyle_to_intacct',
    INTACCT_TO_FYLE = 'intacct_to_fyle'
  }

  export enum IntacctErrorType {
    EMPLOYEE_MAPPING = 'EMPLOYEE_MAPPING',
    CATEGORY_MAPPING = 'CATEGORY_MAPPING',
    INTACCT_ERROR = 'INTACCT_ERROR'
  }

  export enum FyleReferenceType {
    REPORT_ID = 'report_id',
    EXPENSE_REPORT = 'claim_number',
    PAYMENT = 'settlement_id',
    EXPENSE = 'expense_id'
  }

  export enum MappingState {
    MAPPED = 'MAPPED',
    UNMAPPED = 'UNMAPPED',
    ALL = 'ALL'
  }

  export enum SageIntacctField {
    ACCOUNT = 'ACCOUNT',
    CUSTOMER = 'CUSTOMER',
    DEPARTMENT = 'DEPARTMENT',
    CLASS = 'CLASS',
    TAX_CODE = 'TAX_CODE'
  }

  export enum MappingSourceField {
    PROJECT = 'PROJECT',
    COST_CENTER = 'COST_CENTER',
    TAX_GROUP = 'TAX_GROUP'
  }

  export enum MappingDestinationField {
    CUSTOMER = 'CUSTOMER',
    CLASS = 'CLASS',
    DEPARTMENT = 'DEPARTMENT',
    TAX_CODE = 'TAX_CODE'
  }

  export enum TaskLogType {
    CREATING_AP_PAYMENT = 'CREATING_AP_PAYMENT',
    CREATING_EXPENSE_REPORTS = 'CREATING_EXPENSE_REPORTS',
    CREATING_CHARGE_CARD_TRANSACTIONS = 'CREATING_CHARGE_CARD_TRANSACTIONS',
    CREATING_JOURNAL_ENTRIES = 'CREATING_JOURNAL_ENTRIES',
    FETCHING_EXPENSES = 'FETCHING_EXPENSES',
    CREATING_BILLS = 'CREATING_BILLS',
    CREATING_REIMBURSEMENT = 'CREATING_REIMBURSEMENT'
  }

  export enum TaskLogState {
    ENQUEUED = 'ENQUEUED',
    IN_PROGRESS = 'IN_PROGRESS',
    FAILED = 'FAILED',
    FATAL = 'FATAL',
    COMPLETE = 'COMPLETE',
  }

  export enum ExportMode {
    MANUAL = 'MANUAL',
    AUTO = 'AUTO'
  }

  export enum ExportState {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
  }

  export enum PaginatorPage {
    MAPPING = 'mapping',
    DASHBOARD = 'dashboard',
    EXPORT_LOG = 'export-log'
  }

  export enum FieldType {
    TEXT = 'TEXT',
    SELECT = 'SELECT'
  }

  export enum OperatingSystem {
    WIN = 'Win',
    MAC = 'Mac'
  }

  export enum RefinerSurveyType {
    ONBOARDING_DONE = 'Onboarding Done',
    EXPORT_DONE = 'Export Done'
  }

  export enum IntacctLink {
    IMPORT_SETTING = 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c',
    EXPORT_SETTING = 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d',
    ADVANCED_SETTING = 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c',
    LANDING = 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration'
  }
  
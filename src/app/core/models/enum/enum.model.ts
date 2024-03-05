export enum IntegrationView {
  ALL = 'ALL',
  ACCOUNTING = 'ACCOUNTING',
  HRMS = 'HRMS',
  TRAVEL = 'TRAVEL'
}

export enum IntacctCategoryDestination {
  EXPENSE_TYPE = 'EXPENSE_TYPE',
  ACCOUNT = 'ACCOUNT',
  GL_ACCOUNT = 'GL_ACCOUNT'
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
  QBO = 'QuickBooks Online',
  BAMBOO_HR = 'Bamboo HR',
  QBD = 'QuickBooks Desktop',
  TRAVELPERK = 'TravelPerk',
  INTACCT = 'Sage Intacct',
  SAGE300 = 'Sage 300 CRE',
  BUSINESS_CENTRAL = 'Dynamics 365 Business Central',
  NETSUITE = 'NetSuite'
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
  ADVANCED_SETTINGS_INTACCT = 'Advanced Settings Intacct',
}

export enum Sage300UpdateEvent {
  CONNECT_SAGE300 = 'Connect Sage300',
  EXPORT_SETTING_SAGE300 = 'Export Settings Sage300',
  IMPORT_SETTINGS_SAGE300 = 'Import Settings Sage300',
  ADVANCED_SETTINGS_SAGE300 = 'Advanced Settings Sage300',
}

export enum BusinessCentralUpdateEvent {
  CONNECT_BUSINESS_CENTRAL = 'Connect Business Central',
  EXPORT_SETTING_BUSINESS_CENTRAL = 'Export Settings Business Central',
  IMPORT_SETTINGS_BUSINESS_CENTRAL = 'Import Settings Business Central',
  ADVANCED_SETTINGS_BUSINESS_CENTRAL = 'Advanced Settings Business Central',
}

export enum TravelperkUpdateEvent {
  CONNECT_TRAVELPERK = 'Connect Travelperk',
  PAYMENT_PROFILE_SETTINGS_TRAVELPERK = 'Import Settings Travelperk',
  ADVANCED_SETTINGS_TRAVELPERK = 'Advanced Settings Travelperk',
}

export enum AppName {
  BAMBOO_HR = 'BambooHR',
  QBD = 'QuickBooks Desktop',
  TRAVELPERK = 'Travelperk',
  INTACCT = 'Sage Intacct',
  SAGE300 = 'Sage 300 CRE',
  QBO = 'QuickBooks Online',
  BUSINESS_CENTRAL = 'Dynamics 365 Business Central',
  NETSUITE = 'NetSuite'
}

export enum AppNameInService {
  BAMBOO_HR = 'bambooHR',
  QBD = 'qbd',
  TRAVELPERK = 'travelperk',
  INTACCT = 'sage_intacct',
  SAGE300 = 'sage300',
  BUSINESS_CENTRAL = 'business_central'
}

export enum Page {
  LANDING = 'Landing',
  BAMBOO_HR_LANDING = 'Bamboo HR Landing',
  CONNECT_BAMBOO_HR = 'Connect Bamboo HR',
  CONFIGURE_BAMBOO_HR = 'Bamboo HR Configuration',
  QBD_LANDING = 'QuickBooks Desktop Landing',
  INTACCT_LANDING = 'Sage Intacct Landing',
  CONNECT_QBD = 'Connect QuickBooks Desktop',
  CONNECT_INTACCT = 'Connect Sage Intacct',
  EXPORT_SETTING_QBD = 'Export Settings QBD',
  EXPORT_SETTING_INTACCT = 'Export Settings Intacct',
  IMPORT_SETTINGS_INTACCT = 'Import Settings Intacct',
  FIELD_MAPPING_QBD = 'Field Mappings QBD',
  ADVANCED_SETTINGS_QBD = 'Advanced Settings QBD',
  EXPORT_SETTING_SAGE300 = 'Export Settings Sage300',
  IMPORT_SETTINGS_SAGE300 = 'Import Settings Sage300',
  ADVANCED_SETTINGS_SAGE300 = 'Advanced Settings Sage300',
  EXPORT_SETTING_BUSINESS_CENTRAL = 'Export Settings BusinessCentral',
  IMPORT_SETTINGS_BUSINESS_CENTRAL = 'Import Settings BusinessCentral',
  ADVANCED_SETTINGS_BUSINESS_CENTRAL = 'Advanced Settings BusinessCentral',
  PAYMENT_PROFILE_SETTINGS_TRAVELPERK = 'Payment Profile Settings TravelPerk',
  ADVANCED_SETTINGS_TRAVELPERK = 'Advanced Settings TravelPerk',
}

export enum ClickEvent {
  OPEN_QBO_INTEGRATION = 'Open QBO Integration',
  OPEN_NETSUITE_INTEGRATION = 'Open NetSuite Integration',
  OPEN_SAGE_INTACCT_INTEGRATION = 'Open Sage Intacct Integration',
  OPEN_XERO_INTEGRATION = 'Open Xero Integration',
  OPEN_BAMBOO_HR_INTEGRATION = 'Open Bamboo HR Integration',
  OPEN_QBD_INTEGRATION = 'Open QBD Integration',
  INTEGRATION_TABS = 'Integration Tabs',
  CONNECT_BAMBOO_HR = 'Connect Bamboo HR',
  CONFIGURE_BAMBOO_HR = 'Configure Bamboo HR',
  DISCONNECT_BAMBOO_HR = 'Disconnect Bamboo HR',
  CONNECT_QBD = 'Connect QBD',
  COPY_SUPPORT_EMAIL = 'Copy Support Email',
  SYNC_BAMBOO_HR_EMPLOYEES = 'Sync Bamboo HR Employees',
  ADD_BAMBOO_HR_EMAIL_MANUALLY = 'Add Bamboo HR Email Manually',
  ADD_EMAIL_MANUALLY = 'Add Email Manually',
  ADD_CUSTOM_FIELD = 'Add Custom Field',
  QBD_EXPORT = 'Export IIF files',
  CONNECT_INTACCT = 'Connect Sage Intacct',
  PREVIEW_INTACCT_EXPORT = 'Preview Sage Intacct Export',
  INTACCT_EXPORT = 'Export Sage Intacct',
  CONNECT_SAGE300 = 'Connect Sage 300 CRE',
  CONNECT_BUSINESS_CENTRAL = 'Connect Dynamic 365 Business Central'
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

export enum QBOOnboardingState {
  CONNECTION = 'CONNECTION',
  MAP_EMPLOYEES = 'MAP_EMPLOYEES',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_CONFIGURATION = 'ADVANCED_CONFIGURATION',
  COMPLETE = 'COMPLETE',
  CLONE_SETTINGS = 'CLONE_SETTINGS'
}

export enum NetsuiteOnboardingState {
  CONNECTION = 'CONNECTION',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_CONFIGURATION = 'ADVANCED_CONFIGURATION',
  COMPLETE = 'COMPLETE',
}

export enum Sage300OnboardingState {
  CONNECTION = 'CONNECTION',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_SETTINGS = 'ADVANCED_SETTINGS',
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

export enum QBOReimbursableExpensesObject {
  BILL = 'BILL',
  CHECK = 'CHECK',
  JOURNAL_ENTRY = 'JOURNAL ENTRY',
  EXPENSE = 'EXPENSE'
}

export enum QBOCorporateCreditCardExpensesObject {
  CREDIT_CARD_PURCHASE = 'CREDIT CARD PURCHASE',
  BILL = 'BILL',
  JOURNAL_ENTRY = 'JOURNAL ENTRY',
  EXPENSE = 'EXPENSE',
  DEBIT_CARD_EXPENSE = 'DEBIT CARD EXPENSE'
}

export enum NameInJournalEntry {
  EMPLOYEE = 'EMPLOYEE',
  MERCHANT = 'MERCHANT'
}

export enum IntacctCorporateCreditCardExpensesObject {
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
  VERIFIED_AT = 'verified_at',
  APPROVED_AT = 'approved_at',
  CREATED_AT = 'created_at'
}

export enum FyleField {
  EMPLOYEE = 'EMPLOYEE',
  VENDOR = 'VENDOR',
  CATEGORY = 'CATEGORY',
}

export enum ExpenseGroupingFieldOption {
  CLAIM_NUMBER = 'claim_number',
  REPORT_ID = 'report_id',
  SETTLEMENT_ID = 'settlement_id',
  EXPENSE_ID = 'expense_id',
  EXPENSE = 'EXPENSE',
  REPORT = 'REPORT'
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

export enum QBOPaymentSyncDirection {
  FYLE_TO_QBO = 'fyle_to_qbo',
  QBO_TO_FYLE = 'qbo_to_fyle'
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

export enum AccountingField {
  ACCOUNT = 'ACCOUNT'
}

export enum Sage300Field {
  ACCOUNT = 'ACCOUNT',
  CUSTOMER = 'CUSTOMER',
  DEPARTMENT = 'DEPARTMENT',
  CLASS = 'CLASS',
  TAX_DETAIL = 'TAX_DETAIL',
  JOB = 'JOB'
}

export enum BusinessCentralField {
  ACCOUNT = 'ACCOUNT',
  CUSTOMER = 'CUSTOMER',
  DEPARTMENT = 'DEPARTMENT',
  CLASS = 'CLASS',
  TAX_DETAIL = 'TAX_DETAIL',
  JOB = 'JOB',
  COMPANY = 'COMPANY',
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

export enum AppUrl {
  BAMBOO_HR = 'bamboo_hr',
  QBD = 'qbd',
  TRAVELPERK = 'travelperk',
  INTACCT = 'intacct',
  SAGE300 = 'sage300',
  BUSINESS_CENTRAL = 'business_central',
  INTEGRATION = 'integration',
  QBO = 'qbo',
  NETSUITE = 'netsuite'
}

export enum Sage300ExportType {
  PURCHASE_INVOICE = 'PURCHASE_INVOICE',
  DIRECT_COST = 'DIRECT_COST'
}

export enum DefaultImportFields {
  CATEGORY = 'CATEGORY',
  ACCOUNT = 'ACCOUNT',
  VENDOR = 'VENDOR',
  MERCHANTS = 'MERCHANTS',
  LOCATION = 'LOCATION'
}

export enum Sage300ExpenseDate {
  LAST_SPENT_AT = 'LAST_SPENT_AT',
  CURRENT_DATE = 'CURRENT_DATE',
  SPENT_AT = 'SPENT_AT',
  POSTED_AT = 'POSTED_AT'
}

export enum AccountingExportStatus {
  READY = 'READY',
  FAILED = 'FAILED',
  FATAL = 'FATAL',
  COMPLETE = 'COMPLETE',
  IN_PROGRESS = 'IN_PROGRESS',
  ENQUEUED = 'ENQUEUED',
  EXPORT_QUEUED = 'EXPORT_QUEUED'
}

export enum AccountingExportType {
  PURCHASE_INVOICE = 'PURCHASE_INVOICE',
  DIRECT_COSTS = 'DIRECT_COSTS'
}

export enum BusinessCentralAccountingExportType {

}

export enum AccountingErrorType {
  EMPLOYEE_MAPPING = 'EMPLOYEE_MAPPING',
  CATEGORY_MAPPING = 'CATEGORY_MAPPING',
  ACCOUNTING_ERROR = 'ACCOUNTING_ERROR'
}

export enum AccountingExport {
  CREATING_DIRECT_COST = 'CREATING_DIRECT_COST',
  CREATING_PURCHASE_INVOICE = 'CREATING_PURCHASE_INVOICE'
}

export enum Operator {
  IsNull = 'isnull',
  IExact = 'iexact',
  IContains = 'icontains',
  LessThan = 'lt',
  LessThanOrEqual = 'lte'
}

export enum JoinOption {
  AND = 'AND',
  OR = 'OR'
}

export enum CustomOperatorOption {
  Is = 'iexact',
  IsEmpty = 'is_empty',
  IsNotEmpty = 'is_not_empty'
}

export enum IntacctExportSettingDestinationOptionKey {
  VENDOR = 'VENDOR',
  ACCOUNT = 'ACCOUNT',
  EXPENSE_PAYMENT_TYPE = 'EXPENSE_PAYMENT_TYPE',
  CCC_EXPENSE_PAYMENT_TYPE = 'CCC_EXPENSE_PAYMENT_TYPE',
  CHARGE_CARD = 'CHARGE_CARD'
}

export enum IntegrationName {
  SAGE300 = 'SAGE300'
}


export enum BusinessCentralOnboardingState {
  CONNECTION = 'CONNECTION',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_SETTINGS = 'ADVANCED_SETTINGS',
  COMPLETE = 'COMPLETE',
  COMPANY_SELECTION = 'COMPANY_SELECTION'
}

export enum NameInJEField {
  MERCHANT = 'MERCHANT',
}

export enum FundSource {
  PERSONAL = 'PERSONAL',
  CCC = 'CCC',
  REIMBURSABLE = 'Reimbursable',
  CORPORATE_CARD = 'Corporate Card'
}

export enum BusinessCentralExportType {
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  PURCHASE_INVOICE = 'PURCHASE_INVOICE'
}

export enum ExportErrorSourceType {
  EMPLOYEE = 'EMPLOYEE',
  CATEGORY = 'CATEGORY'
}

export enum EmployeeFieldMapping {
  EMPLOYEE = 'EMPLOYEE',
  VENDOR = 'VENDOR'
}

export enum QBOTaskLogType {
  CREATING_BILL = 'CREATING_BILL',
  CREATING_EXPENSE = 'CREATING_EXPENSE',
  CREATING_CHECK = 'CREATING_CHECK',
  CREATING_JOURNAL_ENTRY = 'CREATING_JOURNAL_ENTRY',
  CREATING_CREDIT_CARD_PURCHASE = 'CREATING_CREDIT_CARD_PURCHASE',
  CREATING_CREDIT_CARD_CREDIT = 'CREATING_CREDIT_CARD_CREDIT',
  CREATING_DEBIT_CARD_EXPENSE = 'CREATING_DEBIT_CARD_EXPENSE',
  CREATING_BILL_PAYMENT = 'CREATING_BILL_PAYMENT',
  FETCHING_EXPENSE = 'FETCHING_EXPENSE'
}

export enum LoaderType {
  DETERMINATE = 'determinate',
  INDETERMINATE = 'indeterminate'
}

export enum AccountingDisplayName {
  ACCOUNT = 'Account',
  ITEM = 'Item',
}

export enum QBOField {
  CLASS = 'CLASS',
  DEPARTMENT = 'DEPARTMENT',
  CUSTOMER = 'CUSTOMER',
  TAX_CODE = 'TAX_CODE',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  CREDIT_CARD_ACCOUNT = 'CREDIT_CARD_ACCOUNT',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  VENDOR = 'VENDOR',
}

export enum ConfigurationWarningEvent {
  CLONE_SETTINGS = 'CLONE_SETTINGS',
  INCORRECT_QBO_ACCOUNT_CONNECTED = 'INCORRECT_QBO_ACCOUNT_CONNECTED',
  QBO_EXPORT_SETTINGS = 'QBO_EXPORT_SETTINGS',
  RESET_CONFIGURATION = 'RESET_CONFIGURATION'
}

export enum InputType {
  DROPDOWN = 'DROPDOWN',
  TOGGLE = 'TOGGLE',
  MULTI_SELECT = 'MULTI_SELECT',
}

export enum TrackingApp {
  QBO = 'QBO',
  NETSUITE = 'NS',
  XERO = 'XERO',
  INTACCT = 'SI',
  SAGE300 = 'SAGE300',
  BUSINESS_CENTRAL = 'BC',
  QBD = 'QBD',
  BAMBOO_HR = 'BHR',
  TRAVELPERK = 'TP',
}

export enum ReimbursableImportState {
  PROCESSING = 'processed for payments',
  PAID = 'closed'
}

export enum CCCImportState {
  APPROVED = 'approved',
  PAID = 'closed'
}

export enum TravelPerkExpenseGroup {
  SINGLE= 'SINGLE',
  MULTIPLE = 'MULTIPLE'
}

export enum TravelPerkUserRole {
  CARD_HOLDER = 'CARD_HOLDER',
  TRAVELLER = 'TRAVELLER',
  BOOKER = 'BOOKER'
}

export enum TravelPerkOnboardingState {
  CONNECTION = 'CONNECTION',
  PAYMENT_PROFILE_SETTINGS = 'PAYMENT_PROFILE_SETTINGS',
  ADVANCED_SETTINGS = 'ADVANCED_SETTINGS',
  COMPLETE = 'COMPLETE'
}

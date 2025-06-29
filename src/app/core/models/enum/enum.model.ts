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

export enum NetsuiteCategoryDestination {
  EXPENSE_CATEGORY = 'EXPENSE_CATEGORY',
  ACCOUNT = 'ACCOUNT'
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
  NETSUITE = 'NetSuite',
  XERO = 'Xero',
  QBD_DIRECT = 'QuickBooks Connector'
}

export type IntegrationAppKey = keyof typeof InAppIntegration;

export enum ToastSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
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
  CONNECT_TRAVELPERK = 'Connect TravelPerk',
  PAYMENT_PROFILE_SETTINGS_TRAVELPERK = 'Import Settings TravelPerk',
  ADVANCED_SETTINGS_TRAVELPERK = 'Advanced Settings TravelPerk',
}

export enum QbdDirectUpdateEvent {
  CONFIRM_PRE_REQUISITES_QBD_DIRECT = 'Confirm Pre Requisites QuickBooks Desktop Connector',
  CONNECT_QBD_DIRECT = 'Step 2.1 - Connect QuickBooks Desktop Connector',
  PENDING_QWC_UPLOAD_QBD_DIRECT = 'Step 2.2 - Upload QWC downloaded file to QuickBooks Desktop Connector',
  DESTINATION_SYNC_COMPLETE_QBD_DIRECT = 'Step 2.3 - Sync destination entities with QuickBooks Desktop Connector',
  EXPORT_SETTING_QBD_DIRECT = 'Export Settings QuickBooks Desktop Connector',
  IMPORT_SETTINGS_QBD_DIRECT = 'Import Settings QuickBooks Desktop Connector',
  ADVANCED_SETTINGS_QBD_DIRECT = 'Advanced Settings QuickBooks Desktop Connector',
}

export enum AppName {
  BAMBOO_HR = 'BambooHR',
  QBD = 'QuickBooks Desktop',
  TRAVELPERK = 'TravelPerk',
  INTACCT = 'Sage Intacct',
  SAGE300 = 'Sage 300 CRE',
  QBO = 'QuickBooks Online',
  BUSINESS_CENTRAL = 'Dynamics 365 Business Central',
  NETSUITE = 'NetSuite',
  XERO = 'Xero',
  QBD_DIRECT = 'QuickBooks Desktop Connector'
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
  EXPORT_SETTING_QBD_DIRECT = 'Export Settings QuickBooks Desktop Connector',
  CONNECT_QBD_DIRECT = 'Connect QuickBooks Desktop Connector',
  CONFIRM_PRE_REQUISITES_QBD_DIRECT = 'Confirm Pre Requisites QuickBooks Desktop Connector',
  IMPORT_SETTINGS_QBD_DIRECT = 'Import Settings QuickBooks Desktop Connector',
  ADVANCED_SETTINGS_QBD_DIRECT = 'Advanced Settings QuickBooks Desktop Connector',
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
  CONNECT_BUSINESS_CENTRAL = 'Connect Dynamic 365 Business Central',
  QBD_DIRECT_EXPORT = 'Direct Export Quickbooks Desktop',
  QBD_DIRECT_SYNC = 'Sync Quickbooks Desktop Direct'
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
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_CONFIGURATION = 'ADVANCED_CONFIGURATION',
  COMPLETE = 'COMPLETE',
  CLONE_SETTINGS = 'CLONE_SETTINGS'
}

export enum XeroOnboardingState {
  CONNECTION = 'CONNECTION',
  TENANT_MAPPING = "TENANT_MAPPING",
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_CONFIGURATION = 'ADVANCED_SETTINGS',
  COMPLETE = 'COMPLETE',
  CLONE_SETTINGS = 'CLONE_SETTINGS'
}

export enum NetsuiteOnboardingState {
  CONNECTION = 'CONNECTION',
  SUBSIDIARY = 'SUBSIDIARY',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_CONFIGURATION = 'ADVANCED_CONFIGURATION',
  COMPLETE = 'COMPLETE',
}

export enum Sage300OnboardingState {
  CONNECTION = 'CONNECTION',
  CONNECTOR_AUTH = 'CONNECTOR_AUTH',
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

export enum NetsuiteReimbursableExpensesObject {
  EXPENSE_REPORT = 'EXPENSE REPORT',
  JOURNAL_ENTRY = 'JOURNAL ENTRY',
  BILL = 'BILL'
}

export enum NetSuiteCorporateCreditCardExpensesObject {
  EXPENSE_REPORT = 'EXPENSE REPORT',
  JOURNAL_ENTRY = 'JOURNAL ENTRY',
  CREDIT_CARD_CHARGE = 'CREDIT CARD CHARGE',
  BILL = 'BILL'
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

export enum XeroReimbursableExpensesObject {
  PURCHASE_BILL = 'PURCHASE BILL'
}

export enum XeroCorporateCreditCardExpensesObject {
  BANK_TRANSACTION = 'BANK TRANSACTION'
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
  APPROVED = 'APPROVED',
}

export enum XeroCCCExpenseState {
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
  PROJECT = 'PROJECT',
  COST_CENTER = 'COST_CENTER',
  CORPORATE_CARD = 'CORPORATE_CARD'
}

export enum NetsuiteCustomSegmentOption {
  CUSTOM_LIST = 'CUSTOM_LIST',
  CUSTOM_RECORD = 'CUSTOM_RECORD',
  CUSTOM_SEGMENT = 'CUSTOM_SEGMENT'
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

export enum QbdDirectOnboardingState {
  CONNECTION = 'CONNECTION',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_SETTINGS = 'ADVANCED_SETTINGS',
  COMPLETE = 'COMPLETE',
  YET_TO_START = 'YET_TO_START',
  CONFIRM_PRE_REQUISITES = 'CONFIRM_PRE_REQUISITES',
  PENDING_QWC_UPLOAD = 'PENDING_QWC_UPLOAD',
  INCORRECT_COMPANY_PATH = 'INCORRECT_COMPANY_PATH',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  DESTINATION_SYNC_IN_PROGRESS = 'DESTINATION_SYNC_IN_PROGRESS',
  DESTINATION_SYNC_COMPLETE = 'DESTINATION_SYNC_COMPLETE',
}

export enum ConfigurationCta {
  SAVE = 'Save',
  SAVE_AND_CONTINUE = 'Save and Continue',
  CONTINUE = 'Continue',
  SAVING = 'Saving',
  SYNCING = 'Syncing',
  UPDATE = 'Update connection',
  NEXT = 'Next'
}

export enum QBDReimbursableExpensesObject {
  BILL = 'BILL',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
}

export enum QbdDirectReimbursableExpensesObject {
  BILL = 'BILL',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  CHECK = 'CHECK'
}

export enum QBDCorporateCreditCardExpensesObject {
  CREDIT_CARD_PURCHASE = 'CREDIT_CARD_PURCHASE',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
}

export enum FyleReferenceType {
  REPORT_ID = 'report_id',
  EXPENSE_REPORT = 'claim_number',
  PAYMENT = 'settlement_id',
  EXPENSE = 'expense_id'
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

export enum QbdDirectReimbursableExportDateType {
  LAST_SPENT_AT = 'last_spent_at',
  CURRENT_DATE = 'current_date',
  SPENT_AT = 'spent_at'
}

export enum QbdDirectCCCExportDateType {
  SPENT_AT = 'spent_at',
  CURRENT_DATE = 'current_date',
  POSTED_AT = 'posted_at',
  LAST_SPEND_AT = "last_spend_at"
}


export enum QbdDirectExpenseGroupBy {
  REPORT = 'report_id',
  EXPENSE = 'expense_id'
}

export enum XeroFyleField {
  PROJECT = 'PROJECT',
  CUSTOMER = 'CUSTOMER',
  TAX_CODE = 'TAX_CODE',
  BANK_ACCOUNT = 'BANK_ACCOUNT'
}

export enum NetsuiteFyleField {
  PROJECT = 'PROJECT',
  TAX_ITEM = 'TAX_ITEM'
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
  INTACCT_TO_FYLE = 'intacct_to_fyle',
  FYLE_TO_XERO = 'fyle_to_xero',
  XERO_TO_FYLE = 'xero_to_fyle'
}

export enum QBOPaymentSyncDirection {
  FYLE_TO_QBO = 'fyle_to_qbo',
  QBO_TO_FYLE = 'qbo_to_fyle'
}

export enum NetsuitePaymentSyncDirection {
  FYLE_TO_NETSUITE = 'fyle_to_netsuite',
  NETSUITE_TO_FYLE = 'netsuite_to_fyle'
}

export enum NetsuiteDefaultLevelOptions {
  ALL = 'ALL',
  TRANSACTION_LINE = 'TRANSACTION_LINE',
  TRANSACTION_BODY = 'TRANSACTION_BODY'
}

export enum IntacctErrorType {
  EMPLOYEE_MAPPING = 'EMPLOYEE_MAPPING',
  CATEGORY_MAPPING = 'CATEGORY_MAPPING',
  INTACCT_ERROR = 'INTACCT_ERROR'
}

export enum MappingState {
  MAPPED = 'MAPPED',
  UNMAPPED = 'UNMAPPED',
  ALL = 'ALL'
}

export enum AccountingField {
  ACCOUNT = 'ACCOUNT',
  CONTACT = 'CONTACT'
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
  TAX_CODE = 'TAX_CODE',
  VENDOR = 'VENDOR'
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
  CREATING_REIMBURSEMENT = 'CREATING_REIMBURSEMENT',
  CREATING_BANK_TRANSACTION = 'CREATING_BANK_TRANSACTION',
  CREATING_PAYMENT = 'CREATING_PAYMENT',
  CREATING_BILL = 'CREATING_BILL',
  FETCHING_EXPENSE = 'FETCHING_EXPENSE'
}

export enum TaskLogState {
  ENQUEUED = 'ENQUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
  FATAL = 'FATAL',
  COMPLETE = 'COMPLETE',
  EXPORT_PROCESSED = 'EXPORT_PROCESSED',
  ERROR = "ERROR"
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
  NETSUITE = 'netsuite',
  XERO = 'xero',
  QBD_DIRECT = 'qbd_direct'
}

export enum Sage300ExportType {
  PURCHASE_INVOICE = 'PURCHASE_INVOICE',
  DIRECT_COST = 'DIRECT_COST'
}

export enum DefaultImportFields {
  CATEGORY = 'CATEGORY',
  ACCOUNT = 'ACCOUNT',
  VENDOR = 'VENDOR',
  MERCHANT = 'MERCHANT',
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
  EXPORT_QUEUED = 'EXPORT_QUEUED',
  ERROR = 'ERROR'
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

export enum NetsuiteExportSettingDestinationOptionKey {
  VENDOR = 'VENDOR',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  CREDIT_CARD_ACCOUNT = 'CREDIT_CARD_ACCOUNT',
}

export enum QboExportSettingDestinationOptionKey {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  CREDIT_CARD_ACCOUNT = 'CREDIT_CARD_ACCOUNT',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  VENDOR = 'VENDOR',
  EXPENSE_ACCOUNT = 'EXPENSE_ACCOUNT',
  BANK_ACCOUNT_AND_CREDIT_CARD_ACCOUNT = 'BANK_ACCOUNT_AND_CREDIT_CARD_ACCOUNT'
}

export enum XeroExportSettingDestinationOptionKey {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

export enum Sage300ExportSettingDestinationOptionKey {
  CREDIT_CARD_ACCOUNT = 'CREDIT_CARD_ACCOUNT',
  DEBIT_CARD_ACCOUNT = 'DEBIT_CARD_ACCOUNT',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  JOB = 'JOB',
  VENDOR = 'VENDOR'
}

export enum BCExportSettingDestinationOptionKey {
  VENDOR = 'VENDOR',
  BANK_ACCOUNT = 'BANK_ACCOUNT'
}

export enum QbdDirectExportSettingDestinationOptionKey {
  CREDIT_CARD_ACCOUNT = 'CREDIT_CARD_ACCOUNT',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  ACCOUNT = 'ACCOUNT'
}

export type DestinationOptionKey =
IntacctExportSettingDestinationOptionKey |
NetsuiteExportSettingDestinationOptionKey |
QboExportSettingDestinationOptionKey |
XeroExportSettingDestinationOptionKey |
Sage300ExportSettingDestinationOptionKey |
BCExportSettingDestinationOptionKey |
QbdDirectExportSettingDestinationOptionKey;

export enum QbdDirectExportSettingDestinationAccountType {
  OtherCurrentAsset = 'OtherCurrentAsset',
  CreditCard = 'CreditCard',
  OtherAsset = 'OtherAsset',
  OtherCurrentLiability = 'OtherCurrentLiability',
  OtherIncome = 'OtherIncome',
  Equity = 'Equity',
  AccountsReceivable = 'AccountsReceivable',
  Income = 'Income',
  Expense = 'Expense',
  CostOfGoodsSold = 'CostOfGoodsSold',
  AccountsPayable = 'AccountsPayable',
  Bank = 'Bank',
  LongTermLiability = 'LongTermLiability',
  FixedAsset = 'FixedAsset',
  NonPosting = 'NonPosting',
}

export type DestinationAccountType = QbdDirectExportSettingDestinationAccountType;

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

export enum QbdDirectTaskLogType {
  BILL = 'BILL',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  CREDIT_CARD_PURCHASE = 'CREDIT_CARD_PURCHASE'
}

export enum NetsuiteTaskLogType {
  CREATING_BILL = 'CREATING_BILL',
  CREATING_CREDIT_CARD_CHARGE = 'CREATING_CREDIT_CARD_CHARGE',
  CREATING_JOURNAL_ENTRY = 'CREATING_JOURNAL_ENTRY',
  CREATING_CREDIT_CARD_REFUND = 'CREATING_CREDIT_CARD_REFUND',
  CREATING_EXPENSE_REPORT = 'CREATING_EXPENSE_REPORT',
  FETCHING_EXPENSES = 'FETCHING_EXPENSES'
}

export enum XeroTaskLogType {
  CREATING_BILL = 'CREATING_BILL',
  CREATING_BANK_TRANSACTION = 'CREATING_BANK_TRANSACTION',
  CREATING_PAYMENT = 'CREATING_PAYMENT',
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
  NETSUITE_EXPORT_SETTINGS = 'NETSUITE_EXPORT_SETTINGS',
  XERO_EXPORT_SETTINGS = 'XERO_EXPORT_SETTINGS',
  RESET_CONFIGURATION = 'RESET_CONFIGURATION',
  INTACCT_EXPORT_SETTINGS = 'INTACCT_EXPORT_SETTINGS'
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
  QBD_DIRECT = 'QBD_DIRECT'
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

export enum SplitExpenseGrouping {
  SINGLE_LINE_ITEM = 'SINGLE_LINE_ITEM',
  MULTIPLE_LINE_ITEM = 'MULTIPLE_LINE_ITEM'
}

export enum SizeOption {
  DEFAULT= 'default',
  LARGE = 'large'
}

export enum ThemeOption {
  BRAND = 'brand',
  LIGHT = 'light',
  DARK = 'dark',
  SUCCESS = 'success'
}

export enum QBDPreRequisiteState {
  COMPLETE = 'COMPLETE',
  INCOMPLETE = 'INCOMPLETE'
}

export enum QBDConnectionStatus {
  SUCCESS = 'SUCCESS',
  INCORRECT_COMPANY_PATH = 'INCORRECT_COMPANY_PATH',
  IN_CORRECT_PASSWORD = 'IN_CORRECT_PASSWORD'
}

export enum IframeOrigin {
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  NATIVE_APPS = 'NATIVE_APPS'
}

export enum QBDDirectInteractionType {
  BOOK_SLOT = 'BOOK_SLOT',
  QUERY = 'QUERY'
}
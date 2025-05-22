import { MinimalUser } from "src/app/core/models/db/user.model";
import { AutoMapEmployeeOptions, EmployeeFieldMapping, CCCExpenseState, ExpenseState, ExportDateType, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOOnboardingState, SplitExpenseGrouping, QBOReimbursableExpensesObject, QboExportSettingDestinationOptionKey, Operator, AccountingErrorType, TaskLogState, QBOTaskLogType, AccountingField } from "src/app/core/models/enum/enum.model";
import { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from "src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model";
import { GroupedDestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { SelectFormOption } from "src/app/core/models/common/select-form-option.model";
import { ExportSettingOptionSearch } from "src/app/core/models/common/export-settings.model";
import { FyleField } from "src/app/core/models/db/mapping.model";
import { QBOImportSettingGet } from "src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model";
import { ExpenseFilter, ExpenseFilterPost, ExpenseFilterResponse } from "src/app/core/models/common/advanced-settings.model";
import { AccountingExportSummary } from "src/app/core/models/db/accounting-export-summary.model";
import { Error } from "src/app/core/models/db/error.model";
import { AccountingExport } from "src/app/core/models/db/accounting-export.model";
import { ExpenseGroupResponse } from "src/app/core/models/db/expense-group.model";
import { SkipExportLogResponse } from "src/app/core/models/intacct/db/expense-group.model";
import { Paginator } from "src/app/core/models/misc/paginator.model";
import { MappingSetting } from "src/app/core/models/db/mapping-setting.model";

export const mockUser: MinimalUser = {
    org_id: '123',
    email: 'test@example.com',
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    full_name: 'Test User',
    user_id: 'user123',
    org_name: 'Test Org'
};

export const mockQBOCredential = {
  id: 862,
  refresh_token: "AB11735552393WiGj4YdlGtLE0nHF9iPiF0NjW2wVXRS85jG5D",
  realm_id: "4620816365031245740",
  is_expired: false,
  company_name: "Sandbox Company_US_2",
  country: "US",
  currency: "USD",
  created_at: new Date("2024-09-04T16:09:22.418414Z"),
  updated_at: new Date("2024-09-20T10:00:34.262224Z"),
  workspace: 525
};

export const testOnboardingState = [
  { state: QBOOnboardingState.CONNECTION, route: '/integrations/qbo/onboarding/landing' },
  { state: QBOOnboardingState.EXPORT_SETTINGS, route: '/integrations/qbo/onboarding/export_settings' },
  { state: QBOOnboardingState.IMPORT_SETTINGS, route: '/integrations/qbo/onboarding/import_settings' },
  { state: QBOOnboardingState.ADVANCED_CONFIGURATION, route: '/integrations/qbo/onboarding/advanced_settings' },
  { state: QBOOnboardingState.CLONE_SETTINGS, route: '/integrations/qbo/onboarding/clone_settings' },
  { state: QBOOnboardingState.COMPLETE, route: '/integrations/qbo/main' }
];

export const mockWorkspace = {
    id: '1',
    onboarding_state: QBOOnboardingState.CONNECTION,
    fyle_org_id: 'orh4rnERWDTl',
    fyle_currency: 'USD',
    qbo_realm_id: '4620816365031245740',
    cluster_domain: null,
    app_version: 'v2',
    last_synced_at: null,
    ccc_last_synced_at: null,
    source_synced_at: '2024-09-02T18:51:34.072391Z',
    destination_synced_at: null,
    created_at: '2024-08-22T05:37:32.945879Z',
    updated_at: '2024-09-02T18:51:30.111486Z',
    user: [16]
};

export const mockWorkspaces = [mockWorkspace];

export const mockEmployeeSettingResponse: QBOEmployeeSettingGet = {
    workspace_general_settings: {
      employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
      auto_map_employees: AutoMapEmployeeOptions.EMAIL
    },
    workspace_id: 1
  };

  export const mockEmployeeSettingPayload: QBOEmployeeSettingPost = {
    workspace_general_settings: {
      employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
      auto_map_employees: AutoMapEmployeeOptions.EMAIL
    }
  };

  export const mockEmployeeSettings: QBOEmployeeSettingGet = {
    workspace_general_settings: {
      employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
      auto_map_employees: AutoMapEmployeeOptions.EMAIL
    },
    workspace_id: 1
  };

  export const mockDestinationAttributes = [
    {
      id: 253183,
      attribute_type: 'EMPLOYEE',
      display_name: 'employee',
      value: 'Anish Sinh',
      destination_id: '104',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1
    },
    {
      id: 253195,
      attribute_type: 'VENDOR',
      display_name: 'vendor',
      value: '1',
      destination_id: '215',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1
    }
  ];

  export const employeeSettingsPayload: QBOEmployeeSettingPost = {
    workspace_general_settings: {
      employee_field_mapping: EmployeeFieldMapping.VENDOR,
      auto_map_employees: AutoMapEmployeeOptions.NAME
    }
  };

  export const qboEmployeeSettingResponse: QBOEmployeeSettingGet = {
    workspace_general_settings: {
      employee_field_mapping: EmployeeFieldMapping.VENDOR,
      auto_map_employees: AutoMapEmployeeOptions.NAME
    },
    workspace_id: 1
  };

export const mockExportSettings = {
    "workspace_general_settings": {
        "reimbursable_expenses_object": QBOReimbursableExpensesObject.BILL,
        "corporate_credit_card_expenses_object": QBOCorporateCreditCardExpensesObject.BILL,
        "name_in_journal_entry": NameInJournalEntry.EMPLOYEE
    },
    "expense_group_settings": {
        "reimbursable_expense_group_fields": [
            "fund_source",
            "expense_id",
            "employee_email",
            "spent_at"
        ],
        "corporate_credit_card_expense_group_fields": [
            "claim_number",
            "fund_source",
            "employee_email",
            "verified_at",
            "report_id"
        ],
        "expense_state": ExpenseState.PAYMENT_PROCESSING,
        "ccc_expense_state": CCCExpenseState.APPROVED,
        "reimbursable_export_date_type": ExportDateType.SPENT_AT,
        "ccc_export_date_type": ExportDateType.VERIFIED_AT,
        "split_expense_grouping": SplitExpenseGrouping.MULTIPLE_LINE_ITEM
    },
    "general_mappings": {
        "accounts_payable": {
            "name": "Accounts Payable (A/P) 2",
            "id": "91"
        },
        "qbo_expense_account": {
            "name": null,
            "id": null
        },
        "bank_account": {
            "name": "Checking Debit Card",
            "id": "131"
        },
        "default_ccc_account": {
            "name": null,
            "id": null
        },
        "default_debit_card_account": {
            "name": null,
            "id": null
        },
        "default_ccc_vendor": {
            "name": "Ashwin from NetSuite",
            "id": "110"
        }
    },
    "workspace_id": 512
};

export const mockReimbursableExpenseGroupingDateOptions: SelectFormOption[] = [
  {
    label: 'Current Date',
    value: ExportDateType.CURRENT_DATE
  },
  {
    label: 'Verification date',
    value: ExportDateType.VERIFIED_AT
  },
  {
    label: 'Spend date',
    value: ExportDateType.SPENT_AT
  },
  {
    label: 'Approval date',
    value: ExportDateType.APPROVED_AT
  },
  {
    label: 'Last Spend date',
    value: ExportDateType.LAST_SPENT_AT
  }
];

export const mockCCCExpenseGroupingDateOptions: SelectFormOption[] = [
  {
    label: 'Export Date',
    value: ExportDateType.CURRENT_DATE
  },
  {
    label: 'Verification date',
    value: ExportDateType.VERIFIED_AT
  },
  {
    label: 'Spend date',
    value: ExportDateType.SPENT_AT
  },
  {
    label: 'Approval date',
    value: ExportDateType.APPROVED_AT
  },
  {
    label: 'Last Spend date',
    value: ExportDateType.LAST_SPENT_AT
  }
];

export const mockCCCExpenseGroupingDateOptionsForCreditDebit: SelectFormOption[] = [
  {
    label: 'Card Transaction Post Date',
    value: ExportDateType.POSTED_AT
  },
  {
    label: 'Spend date',
    value: ExportDateType.SPENT_AT
  }
];

export const mockCCCExpenseDateGrouping: SelectFormOption[] = [
  {label: 'Export date', value: ExportDateType.CURRENT_DATE},
  {label: 'Verification date', value: ExportDateType.VERIFIED_AT},
  {label: 'Spend date', value: ExportDateType.SPENT_AT}
];

export const mockReimbursableExpenseDateGrouping: SelectFormOption[] = [
  {label: 'Export date', value: ExportDateType.CURRENT_DATE},
  {label: 'Spend date', value: ExportDateType.SPENT_AT}
];

export const mockPaginatedDestinationAttributes = {
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 253175,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Ashwin Bankkkk",
            "destination_id": "167",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Ashwin Bankkkk"
            },
            "code": 'anish',
            "created_at": new Date("2024-08-22T06:44:11.074373Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074401Z"),
            "workspace": 512
        },
        {
            "id": 253176,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Checking",
            "destination_id": "35",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Checking"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074447Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074458Z"),
            "workspace": 512
        },
        {
            "id": 253177,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Checking Debit Card",
            "destination_id": "131",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Checking Debit Card"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074498Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074508Z"),
            "workspace": 512
        },
        {
            "id": 253178,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Gayathiri",
            "destination_id": "128",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Gayathiri"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074544Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074554Z"),
            "workspace": 512
        },
        {
            "id": 253179,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Savings",
            "destination_id": "36",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Savings"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074591Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074601Z"),
            "workspace": 512
        }
    ]
};

export const mockWorkspaceGeneralSettings = {
  id: 684,
  reimbursable_expenses_object: QBOReimbursableExpensesObject.BILL,
  corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.BILL,
  employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
  map_merchant_to_vendor: true,
  import_categories: true,
  import_items: false,
  import_projects: false,
  import_tax_codes: false,
  change_accounting_period: false,
  charts_of_accounts: [
    'Expense'
  ],
  memo_structure: [
    'employee_email',
    'purpose',
    'category',
    'spent_on',
    'report_number',
    'expense_link'
  ],
  auto_map_employees: AutoMapEmployeeOptions.NAME,
  auto_create_destination_entity: false,
  auto_create_merchants_as_vendors: false,
  sync_fyle_to_qbo_payments: false,
  sync_qbo_to_fyle_payments: true,
  category_sync_version: 'v2',
  je_single_credit_line: false,
  map_fyle_cards_qbo_account: false,
  import_vendors_as_merchants: false,
  is_multi_currency_allowed: false,
  name_in_journal_entry: NameInJournalEntry.EMPLOYEE,
  created_at: new Date('2024-08-22T08:50:29.978051Z'),
  updated_at: new Date('2024-09-02T17:28:32.233045Z'),
  workspace: 512
};

export const mockBankAccounts: PaginatedDestinationAttribute = {
  count: 5,
  next: null,
  previous: null,
  results: [
    {
      id: 253175,
      attribute_type: 'BANK_ACCOUNT',
      display_name: 'Bank Account',
      value: 'Ashwin Bankkkk',
      destination_id: '167',
      active: true,
      created_at: new Date("2024-08-22T06:44:11.074373Z"),
      updated_at: new Date("2024-08-22T06:44:11.074401Z"),
      workspace: 512
    },
    {
      id: 253176,
      attribute_type: 'BANK_ACCOUNT',
      display_name: 'Bank Account',
      value: 'Checking',
      destination_id: '35',
      active: true,
      created_at: new Date("2024-08-22T06:44:11.074447Z"),
      updated_at: new Date("2024-08-22T06:44:11.074458Z"),
      workspace: 512
    },
    {
      id: 253177,
      attribute_type: 'BANK_ACCOUNT',
      display_name: 'Bank Account',
      value: 'Checking Debit Card',
      destination_id: '131',
      active: true,
      created_at: new Date("2024-08-22T06:44:11.074498Z"),
      updated_at: new Date("2024-08-22T06:44:11.074508Z"),
      workspace: 512
    },
    {
      id: 253178,
      attribute_type: 'BANK_ACCOUNT',
      display_name: 'Bank Account',
      value: 'Gayathiri',
      destination_id: '128',
      active: true,
      created_at: new Date("2024-08-22T06:44:11.074544Z"),
      updated_at: new Date("2024-08-22T06:44:11.074554Z"),
      workspace: 512
    },
    {
      id: 253179,
      attribute_type: 'BANK_ACCOUNT',
      display_name: 'Bank Account',
      value: 'Savings',
      destination_id: '36',
      active: true,
      created_at: new Date("2024-08-22T06:44:11.074591Z"),
      updated_at: new Date("2024-08-22T06:44:11.074601Z"),
      workspace: 512
    }
  ]
};

export const mockCreditCardAccounts: PaginatedDestinationAttribute = {
    count: 3,
    next: null,
    previous: null,
    results: [
      {
        id: 253172,
        attribute_type: 'CREDIT_CARD_ACCOUNT',
        display_name: 'Credit Card Account',
        value: 'Mastercard',
        destination_id: '41',
        active: true,
        created_at: new Date("2024-08-22T06:44:11.012441Z"),
        updated_at: new Date("2024-08-22T06:44:11.012465Z"),
        workspace: 512
      },
      {
        id: 253173,
        attribute_type: 'CREDIT_CARD_ACCOUNT',
        display_name: 'Credit Card Account',
        value: 'QBO CCC Support Account',
        destination_id: '130',
        active: true,
        created_at: new Date("2024-08-22T06:44:11.012505Z"),
        updated_at: new Date("2024-08-22T06:44:11.012514Z"),
        workspace: 512
      },
      {
        id: 253174,
        attribute_type: 'CREDIT_CARD_ACCOUNT',
        display_name: 'Credit Card Account',
        value: 'Visa',
        destination_id: '42',
        active: true,
        created_at: new Date("2024-08-22T06:44:11.012550Z"),
        updated_at: new Date("2024-08-22T06:44:11.012559Z"),
        workspace: 512
      }
    ]
  };

  export const mockAccountsPayable: PaginatedDestinationAttribute = {
    count: 3,
    next: null,
    previous: null,
    results: [
      {
        id: 253180,
        attribute_type: 'ACCOUNTS_PAYABLE',
        display_name: 'Accounts Payable',
        value: 'Accounts Payable (A/P)',
        destination_id: '33',
        active: true,
        created_at: new Date("2024-08-22T06:44:11.122791Z"),
        updated_at: new Date("2024-08-22T06:44:11.122810Z"),
        workspace: 512
      },
      {
        id: 253181,
        attribute_type: 'ACCOUNTS_PAYABLE',
        display_name: 'Accounts Payable',
        value: 'Accounts Payable (A/P) 2',
        destination_id: '91',
        active: true,
        created_at: new Date("2024-08-22T06:44:11.122836Z"),
        updated_at: new Date("2024-08-22T06:44:11.122842Z"),
        workspace: 512
      },
      {
        id: 253182,
        attribute_type: 'ACCOUNTS_PAYABLE',
        display_name: 'Accounts Payable',
        value: 'Employee Reimbursables',
        destination_id: '129',
        active: true,
        created_at: new Date("2024-08-22T06:44:11.122862Z"),
        updated_at: new Date("2024-08-22T06:44:11.122867Z"),
        workspace: 512
      }
    ]
  };

  export const mockVendors: PaginatedDestinationAttribute = {
    count: 182,
    next: "http://quickbooks-api.staging-integrations:8000/api/workspaces/512/mappings/paginated_destination_attributes/?active=true&attribute_type=VENDOR&limit=100&offset=100",
    previous: null,
    results: [
      {
        id: 253195,
        attribute_type: 'VENDOR',
        display_name: 'vendor',
        value: '1',
        destination_id: '215',
        active: true,
        created_at: new Date("2024-08-22T06:44:16.926440Z"),
        updated_at: new Date("2024-08-22T06:44:16.926468Z"),
        workspace: 512
      },
      {
        id: 253196,
        attribute_type: 'VENDOR',
        display_name: 'vendor',
        value: 'AMAZON MKTPLACE',
        destination_id: '159',
        active: true,
        created_at: new Date("2024-08-22T06:44:16.926507Z"),
        updated_at: new Date("2024-08-22T06:44:16.926517Z"),
        workspace: 512
      },
      {
        id: 253294,
        attribute_type: 'VENDOR',
        display_name: 'vendor',
        value: 'Mahoney Mugs',
        destination_id: '43',
        active: true,
        created_at: new Date("2024-08-22T06:44:16.992351Z"),
        updated_at: new Date("2024-08-22T06:44:16.992356Z"),
        workspace: 512
      }
    ]
  };

  export const mockExportSettingsResponse: any = {
    workspace_general_settings: {
      reimbursable_expenses_object: QBOReimbursableExpensesObject.BILL,
      corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.BILL,
      name_in_journal_entry: NameInJournalEntry.EMPLOYEE
    },
    expense_group_settings: {
      reimbursable_expense_group_fields: [
        'fund_source',
        'expense_id',
        'employee_email',
        'spent_at'
      ],
      corporate_credit_card_expense_group_fields: [
        'claim_number',
        'fund_source',
        'employee_email',
        'verified_at',
        'report_id'
      ],
      expense_state: ExpenseState.PAYMENT_PROCESSING,
      ccc_expense_state: CCCExpenseState.APPROVED,
      reimbursable_export_date_type: ExportDateType.SPENT_AT,
      ccc_export_date_type: ExportDateType.VERIFIED_AT,
      split_expense_grouping: SplitExpenseGrouping.MULTIPLE_LINE_ITEM
    },
    general_mappings: {
      accounts_payable: {
        name: 'Accounts Payable (A/P) 2',
        id: '91'
      },
      qbo_expense_account: {
        name: null,
        id: null
      },
      bank_account: {
        name: 'Checking Debit Card',
        id: '131'
      },
      default_ccc_account: {
        name: null,
        id: null
      },
      default_debit_card_account: {
        name: null,
        id: null
      },
      default_ccc_vendor: {
        name: 'Ashwin from NetSuite',
        id: '110'
      }
    },
    workspace_id: 512
  };

  export const mockExportSettingSaveResponse = {
    "workspace_general_settings": {
        "reimbursable_expenses_object": "BILL",
        "corporate_credit_card_expenses_object": "BILL",
        "name_in_journal_entry": "EMPLOYEE"
    },
    "expense_group_settings": {
        "reimbursable_expense_group_fields": [
            "employee_email",
            "fund_source",
            "expense_id",
            "spent_at"
        ],
        "corporate_credit_card_expense_group_fields": [
            "claim_number",
            "employee_email",
            "fund_source",
            "verified_at",
            "report_id"
        ],
        "expense_state": "PAYMENT_PROCESSING",
        "ccc_expense_state": "APPROVED",
        "reimbursable_export_date_type": "spent_at",
        "ccc_export_date_type": "verified_at",
        "split_expense_grouping": "MULTIPLE_LINE_ITEM"
    },
    "general_mappings": {
        "accounts_payable": {
            "name": "Accounts Payable (A/P) 2",
            "id": "91"
        },
        "qbo_expense_account": {
            "name": null,
            "id": null
        },
        "bank_account": {
            "name": "Checking Debit Card",
            "id": "131"
        },
        "default_ccc_account": {
            "name": null,
            "id": null
        },
        "default_debit_card_account": {
            "name": null,
            "id": null
        },
        "default_ccc_vendor": {
            "name": "Ashwin from NetSuite",
            "id": "110"
        }
    },
    "workspace_id": 512
};

export const mockExportSettingOptionSearch: ExportSettingOptionSearch = {
  searchTerm: 'anish',
  destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
  destinationAttributes: [],
  formControllerName: 'bankAccount'
};

export const mockExpenseAccountEvent: ExportSettingOptionSearch = {
  searchTerm: 'anish',
  destinationOptionKey: QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT,
  destinationAttributes: [],
  formControllerName: 'expenseAccount'
};

export const mockGeneralEvent: ExportSettingOptionSearch = {
  searchTerm: 'anish',
  destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
  destinationAttributes: [],
  formControllerName: 'bankAccount'
};

// ... (existing imports and fixtures)

export const mockBrandingConfig: any = {
  featureFlags: {
    mapEmployees: false,
    cloneSettings: false,
    exportSettings: {
      reimbursableExpenses: false,
      nameInJournalEntry: false,
      useMerchantInJournalLine: false,
      splitExpenseGrouping: false
    },
    importSettings: {
      tax: false,
      importVendorsAsMerchants: false,
      importNetsuiteEmployees: false,
      importItems: false,
      importProjects: false,
      allowCustomSegment: false,
      dependentField: false,
      allowImportCode: false
    },
    advancedSettings: {
      autoCreateVendors: false,
      paymentsSync: false,
      singleCreditLineJE: false,
      emailNotification: false,
      skipExport: false,
      defaultFields: false,
      autoCreateContacts: false,
      useEmployeeAttributes: false,
      autoCreateMerchants: false
    },
    exportLog: {
      expenseType: false
    },
    mappings: {
      employeeMapping: false
    },
    dashboard: {
      disconnectButton: false
    }
  },
  illustrationsAllowed: false,
  isGradientAllowed: false,
  isIconsInsideButtonAllowed: false,
  exposeC1Apps: false,
  isBackgroundColorAllowed: false,
  isAsterikAllowed: false,
  allowIntacctHelperDoc: false
};

export const mockExportSettingFormValueforNavigate = {
  workspaceGeneralSettings: {
    reimbursableExpensesObject: 'BILL',
    corporateCreditCardExpensesObject: 'CREDIT_CARD_PURCHASE',
    isSimplifyReportClosureEnabled: true,
    nameInJournalEntry: 'EMPLOYEE'
  },
  expenseGroupSettings: {
    expenseState: 'PAYMENT_PROCESSING',
    reimbursableExpenseGroupFields: ['EXPENSE_ID'],
    corporateCreditCardExpenseGroupFields: ['EXPENSE_ID'],
    splitExpenseGrouping: SplitExpenseGrouping.MULTIPLE_LINE_ITEM
  },
  generalMappings: {
    bankAccount: { id: '1', name: 'Bank Account' },
    accountsPayable: { id: '2', name: 'Accounts Payable' },
    defaultCCCAccount: { id: '3', name: 'Credit Card Account' },
    defaultVendor: { id: '4', name: 'Default Vendor' }
  }
};

// Set up the mock data
export const mockDateOptionsforWatchers = [
  { label: 'Current Date', value: 'current_date' },
  { label: 'Verification date', value: 'verified_at' },
  { label: 'Spend date', value: 'spent_at' },
  { label: 'Approval date', value: 'approved_at' },
  { label: 'Last Spend date', value: 'last_spent_at' }
];

// ... existing code ...

export const mockTaxCodeDestinationAttribute = [
  {
    id: 260093,
    attribute_type: "TAX_CODE",
    display_name: "Tax Code",
    value: "Out of scope @0%",
    destination_id: "4",
    auto_created: false,
    active: true,
    detail: {
      tax_rate: 0,
      tax_refs: [
        {
          name: "NO TAX PURCHASE",
          value: "5",
          taxRate: 0
        }
      ]
    },
    code: null,
    created_at: "2024-09-04T16:09:44.613162Z",
    updated_at: "2024-09-04T16:09:44.613178Z",
    workspace: 525
  }
];

export const mockImportCodeFieldConfig = {"ACCOUNT": false};

export const mockGeneralSettings = {
  id: 708,
  reimbursable_expenses_object: null,
  corporate_credit_card_expenses_object: "CREDIT CARD PURCHASE",
  employee_field_mapping: "EMPLOYEE",
  map_merchant_to_vendor: true,
  import_categories: true,
  import_items: true,
  import_projects: false,
  import_tax_codes: false,
  change_accounting_period: false,
  charts_of_accounts: [
    "Expense",
    "Other Expense",
    "Fixed Asset",
    "Cost of Goods Sold",
    "Current Liability",
    "Equity",
    "Other Current Liability",
    "Long Term Liability",
    "Other Current Asset",
    "Current Asset",
    "Income",
    "Other Income"
  ],
  memo_structure: [
    "employee_email",
    "purpose",
    "category",
    "spent_on",
    "report_number",
    "expense_link"
  ],
  auto_map_employees: "EMAIL",
  auto_create_destination_entity: false,
  auto_create_merchants_as_vendors: false,
  sync_fyle_to_qbo_payments: false,
  sync_qbo_to_fyle_payments: false,
  category_sync_version: "v2",
  je_single_credit_line: false,
  map_fyle_cards_qbo_account: true,
  import_vendors_as_merchants: true,
  is_multi_currency_allowed: false,
  name_in_journal_entry: "EMPLOYEE",
  import_code_fields: [],
  created_at: "2024-09-04T16:23:13.895369Z",
  updated_at: "2024-09-04T16:37:49.361243Z",
  workspace: 525
};

export const mockQboFields = [
  {
    attribute_type: "CLASS",
    display_name: "class"
  },
  {
    attribute_type: "CUSTOMER",
    display_name: "customer"
  },
  {
    attribute_type: "DEPARTMENT",
    display_name: "Department"
  }
];

export const mockFyleExpenseFields: FyleField[] = [
  {
    attribute_type: "COST_CENTER",
    display_name: "Cost Center",
    is_dependent: false
  },
  {
    attribute_type: "PROJECT",
    display_name: "Project",
    is_dependent: false
  },
  {
    attribute_type: "CATEGORY_CUSTOM",
    display_name: "Category Custom",
    is_dependent: false
  },
  {
    attribute_type: "CUSTOM_#1",
    display_name: "Custom #1",
    is_dependent: false
  },
  {
    attribute_type: "PROJECT_CUSTOM",
    display_name: "Project Custom",
    is_dependent: false
  }
];

// Import settings
export const mockImportSettings: QBOImportSettingGet = {
  workspace_general_settings: {
    import_categories: true,
    import_items: true,
    import_vendors_as_merchants: true,
    charts_of_accounts: [
      "Expense",
      "Other Expense",
      "Fixed Asset",
      "Cost of Goods Sold",
      "Current Liability",
      "Equity",
      "Other Current Liability",
      "Long Term Liability",
      "Other Current Asset",
      "Current Asset",
      "Income",
      "Other Income"
    ],
    import_tax_codes: false,
    import_code_fields: []
  },
  general_mappings: {
    default_tax_code: {
      name: null,
      id: null
    }
  },
  mapping_settings: [
    {
      id: 1,
      created_at: new Date("2024-01-01T00:00:00Z"),
      updated_at: new Date("2024-01-01T00:00:00Z"),
      workspace: 525,
      source_field: "PROJECT",
      destination_field: "CLASS",
      import_to_fyle: true,
      is_custom: false,
      source_placeholder: null
    },
    {
      id: 2,
      created_at: new Date("2024-01-01T00:00:00Z"),
      updated_at: new Date("2024-01-01T00:00:00Z"),
      workspace: 525,
      source_field: "COST_CENTER",
      destination_field: "CUSTOMER",
      import_to_fyle: true,
      is_custom: false,
      source_placeholder: null
    },
    {
      id: 3,
      created_at: new Date("2024-01-01T00:00:00Z"),
      updated_at: new Date("2024-01-01T00:00:00Z"),
      workspace: 525,
      source_field: "PROJECT_CUSTOM",
      destination_field: "DEPARTMENT",
      import_to_fyle: true,
      is_custom: true,
      source_placeholder: null
    }
  ],
  workspace_id: 525
};

export const mockImportCodeSelectorOptions = {
  ACCOUNT: [
    { label: 'Import Codes + Names', subLabel: '4567 Meals & Entertainment', value: true },
    { label: 'Import Names only', subLabel: 'Meals & Entertainment', value: false }
  ],
  CUSTOMER: [
    { label: 'Customer 1', subLabel: 'subLabel 3', value: true },
    { label: 'Customer 2', subLabel: 'subLabel 4', value: false }
  ]
};

// Qbo adavanced settings
export const mockQboAdvancedSettings = {
  "workspace_general_settings": {
      "sync_fyle_to_qbo_payments": false,
      "sync_qbo_to_fyle_payments": false,
      "auto_create_destination_entity": false,
      "auto_create_merchants_as_vendors": false,
      "je_single_credit_line": false,
      "change_accounting_period": true,
      "memo_structure": [
          "employee_email",
          "merchant",
          "purpose",
          "category",
          "spent_on",
          "report_number",
          "expense_link"
      ]
  },
  "general_mappings": {
      "bill_payment_account": {
          "id": null,
          "name": null
      }
  },
  "workspace_schedules": {
      "enabled": true,
      "interval_hours": 1,
      "additional_email_options": [],
      "emails_selected": [
          "admin1@fylefororion.fyle.in",
          "owner@fylefororion.fyle.in"
      ],
      "is_real_time_export_enabled": true
  },
  "workspace_id": 525
};

export const mockExpenseFilter: ExpenseFilterPost = {
  condition: "category",
  operator: Operator.IExact,
  values: ["anish"],
  rank: 1,
  join_by: null,
  is_custom: false,
  custom_field_type: null
};

export const mockExpenseFilter1: ExpenseFilter = {
  id: 1,
  condition: 'category',
  operator: Operator.IContains,
  values: ['test'],
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 1,
  rank: 1,
  join_by: null,
  is_custom: false,
  custom_field_type: null
};
export const mockExpenseFilter2: ExpenseFilter = {
  id: 2,
  condition: 'amount',
  operator: Operator.LessThanOrEqual,
  values: ['100'],
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 1,
  rank: 2,
  join_by: null,
  is_custom: false,
  custom_field_type: null
};

// Settings general for advanced settings
export const mockSettingsGeneral = {
  "id": 708,
  "reimbursable_expenses_object": null,
  "corporate_credit_card_expenses_object": "CREDIT CARD PURCHASE",
  "employee_field_mapping": "EMPLOYEE",
  "map_merchant_to_vendor": true,
  "import_categories": true,
  "import_items": true,
  "import_projects": false,
  "import_tax_codes": false,
  "change_accounting_period": true,
  "charts_of_accounts": [
      "Expense",
      "Other Expense",
      "Fixed Asset",
      "Cost of Goods Sold",
      "Current Liability",
      "Equity",
      "Other Current Liability",
      "Long Term Liability",
      "Other Current Asset",
      "Current Asset",
      "Income",
      "Other Income"
  ],
  "memo_structure": [
      "employee_email",
      "merchant",
      "purpose",
      "category",
      "spent_on",
      "report_number",
      "expense_link"
  ],
  "auto_map_employees": "EMAIL",
  "auto_create_destination_entity": false,
  "auto_create_merchants_as_vendors": false,
  "sync_fyle_to_qbo_payments": false,
  "sync_qbo_to_fyle_payments": false,
  "category_sync_version": "v2",
  "je_single_credit_line": false,
  "map_fyle_cards_qbo_account": true,
  "import_vendors_as_merchants": true,
  "is_multi_currency_allowed": false,
  "name_in_journal_entry": "EMPLOYEE",
  "import_code_fields": [],
  "created_at": "2024-09-04T16:23:13.895369Z",
  "updated_at": "2024-09-20T10:52:47.925962Z",
  "workspace": 525
};

// Admins for advanced settings
export const mockAdmins = [
  {
      "name": "Theresa Brown",
      "email": "admin1@fylefororion.fyle.in"
  },
  {
      "name": "Fyle For Orion",
      "email": "owner@fylefororion.fyle.in"
  }
];

// Custom_fields for advanced settings
export const mockCustomFields = [
  {
      "field_name": "employee_email",
      "type": "SELECT",
      "is_custom": false
  },
  {
      "field_name": "claim_number",
      "type": "TEXT",
      "is_custom": false
  },
  {
      "field_name": "report_title",
      "type": "TEXT",
      "is_custom": false
  },
  {
      "field_name": "spent_at",
      "type": "DATE",
      "is_custom": false
  },
  {
      "field_name": "category",
      "type": "SELECT",
      "is_custom": false
  },
  {
      "field_name": "Custom #1",
      "type": "SELECT",
      "is_custom": true
  },
  {
      "field_name": "Project Custom",
      "type": "SELECT",
      "is_custom": true
  },
  {
      "field_name": "Custom Expense Field",
      "type": "TEXT",
      "is_custom": true
  },
  {
      "field_name": "Category Custom",
      "type": "SELECT",
      "is_custom": true
  }
];

// Skip export settings GET
export const mockSkipExportSettings: ExpenseFilterResponse = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: 74,
      condition: "category",
      operator: Operator.IContains,
      values: ["anish"],
      rank: 1,
      join_by: null,
      is_custom: false,
      custom_field_type: null,
      created_at: new Date("2024-09-20T10:52:47.918770Z"),
      updated_at: new Date("2024-09-20T10:52:47.918838Z"),
      workspace: 525
    }
  ]
};

export const mockGroupedDestinationAttributes: any = {
  BANK_ACCOUNT: mockBankAccounts.results,
  ACCOUNT: [],
  EXPENSE_TYPE: [],
  EXPENSE_PAYMENT_TYPE: [],
  VENDOR_PAYMENT_ACCOUNT: [],
  VENDOR: mockVendors.results,
  CHARGE_CARD_NUMBER: [],
  TAX_DETAIL: [],
  LOCATION: [],
  DEPARTMENT: [],
  PROJECT: [],
  CLASS: [],
  ITEM: [],
  PAYMENT_ACCOUNT: [],
  EMPLOYEE: [],
  JOB: [],
  CREDIT_CARD_ACCOUNT: mockCreditCardAccounts.results,
  ACCOUNTS_PAYABLE: mockAccountsPayable.results,
  TAX_CODE: mockTaxCodeDestinationAttribute,
  COMPANY: []
};

export const mockAdditionalEmails = [
  { name: 'Additional User', email: 'additional@example.com' }
];

export const mockExpenseFilterResponse = {
  ...mockExpenseFilter,
  id: 75,
  created_at: new Date('2023-05-01T12:00:00Z'),
  updated_at: new Date('2023-05-01T12:00:00Z'),
  workspace: 525
};

export const mockMemo = ['employee_email', 'merchant', 'purpose'];
export const mockFormattedMemo = ['employee_email', 'merchant', 'purpose', 'category'];
export const mockInitialMemoStructure = ['employee_email', 'merchant'];
export const mocknewMemoStructure = ['employee_email', 'category', 'purpose'];
export const mockDefaultMemoOptions = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on'];
export const invalidMemoStructure = ['invalid_field', 'employee_email'];

// QBO Dashboard
export const mockExportableExpenseGroup = {
    "exportable_expense_group_ids": [
        8087,
        8088,
        8089,
        8090,
        8091,
        8092,
        8093,
        8094,
        8095
    ]
};

export const mockExportSettingsforDashboard = {
    "expense_group_settings": {
        "reimbursable_expense_group_fields": [
            "employee_email",
            "cost_center",
            "fund_source",
            "expense_id"
        ],
        "reimbursable_export_date_type": "current_date",
        "expense_state": "PAYMENT_PROCESSING",
        "corporate_credit_card_expense_group_fields": [
            "report_id",
            "cost_center",
            "fund_source",
            "employee_email",
            "claim_number"
        ],
        "ccc_export_date_type": "current_date",
        "ccc_expense_state": null
    },
    "configuration": {
        "reimbursable_expenses_object": "EXPENSE REPORT",
        "corporate_credit_card_expenses_object": null,
        "name_in_journal_entry": "MERCHANT",
        "employee_field_mapping": "EMPLOYEE",
        "auto_map_employees": "EMAIL"
    },
    "general_mappings": {
        "reimbursable_account": {
            "id": "2",
            "name": "Savings"
        },
        "default_ccc_account": {
            "id": null,
            "name": null
        },
        "accounts_payable": {
            "id": null,
            "name": null
        },
        "default_ccc_vendor": {
            "id": null,
            "name": null
        }
    },
    "workspace_id": 297
};

export const mockExportErrors: Error[] = [
  {
      id: 3301,
      expense_attribute: {
          id: 1468902,
          attribute_type: "CATEGORY",
          display_name: "Category",
          value: "ABN Withholding",
          source_id: "248995",
          auto_mapped: false,
          auto_created: false,
          active: true,
          detail: null,
          created_at: "2024-09-17T11:20:35.804644Z",
          updated_at: "2024-09-17T11:20:35.804648Z",
          workspace: 530
      },
      expense_group: {} as AccountingExport,
      type: AccountingErrorType.CATEGORY_MAPPING,
      article_link: "",
      is_resolved: false,
      error_title: "ABN Withholding",
      error_detail: "Category mapping is missing",
      created_at: new Date("2024-09-25T12:06:26.035205Z"),
      updated_at: new Date("2024-09-25T12:08:26.638480Z"),
      workspace: 530
  },
  {
      id: 3302,
      expense_attribute: {
          id: 1469125,
          attribute_type: "CATEGORY",
          display_name: "Category",
          value: "Airfare",
          source_id: "132580",
          auto_mapped: false,
          auto_created: false,
          active: true,
          detail: null,
          created_at: "2024-09-17T11:20:35.804644Z",
          updated_at: "2024-09-17T11:20:35.804648Z",
          workspace: 530
      },
      expense_group: {} as AccountingExport,
      type: AccountingErrorType.CATEGORY_MAPPING,
      article_link: "",
      is_resolved: false,
      error_title: "Airfare",
      error_detail: "Category mapping is missing",
      created_at: new Date("2024-09-25T12:06:40.991166Z"),
      updated_at: new Date("2024-09-25T12:06:40.991180Z"),
      workspace: 530
  }
];

export const mockQBOTaskResponse = {
  "count": 12,
  "next": null,
  "previous": null,
  "results": [
      {
          "id": 38657,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "Food",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16064
              }
          ],
          "created_at": "2024-09-25T12:05:42.350569Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:06:05.761286Z",
          "workspace": 530,
          "expense_group": 16064,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38660,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "ABN Withholding",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16067
              }
          ],
          "created_at": "2024-09-25T12:05:42.390170Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:06:26.043770Z",
          "workspace": 530,
          "expense_group": 16067,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38663,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "Airfare",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16070
              }
          ],
          "created_at": "2024-09-25T12:05:42.437580Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:06:41.001572Z",
          "workspace": 530,
          "expense_group": 16070,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38665,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "ABN Withholding",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16072
              }
          ],
          "created_at": "2024-09-25T12:05:42.464238Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:06:56.041377Z",
          "workspace": 530,
          "expense_group": 16072,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38656,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "Food",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16063
              }
          ],
          "created_at": "2024-09-25T12:05:42.328216Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:06:00.856240Z",
          "workspace": 530,
          "expense_group": 16063,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38668,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "ABN Withholding",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16075
              }
          ],
          "created_at": "2024-09-25T12:05:42.501408Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:07:16.186790Z",
          "workspace": 530,
          "expense_group": 16075,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38669,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "ABN Withholding",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16076
              }
          ],
          "created_at": "2024-09-25T12:05:42.513828Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:07:21.310032Z",
          "workspace": 530,
          "expense_group": 16076,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38680,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "ABN Withholding",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16087
              }
          ],
          "created_at": "2024-09-25T12:05:42.657958Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:08:26.642144Z",
          "workspace": 530,
          "expense_group": 16087,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38658,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "Food",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16065
              }
          ],
          "created_at": "2024-09-25T12:05:42.365838Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:06:10.795891Z",
          "workspace": 530,
          "expense_group": 16065,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38679,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "ABN Withholding",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16086
              }
          ],
          "created_at": "2024-09-25T12:05:42.644626Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:08:21.624810Z",
          "workspace": 530,
          "expense_group": 16086,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38671,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "ABN Withholding",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16078
              }
          ],
          "created_at": "2024-09-25T12:05:42.539216Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:07:36.337016Z",
          "workspace": 530,
          "expense_group": 16078,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      },
      {
          "id": 38674,
          "type": "CREATING_CREDIT_CARD_PURCHASE",
          "task_id": null,
          "status": "FAILED",
          "detail": [
              {
                  "row": 0,
                  "type": "Category Mapping",
                  "value": "ABN Withholding",
                  "message": "Category Mapping not found",
                  "expense_group_id": 16081
              }
          ],
          "created_at": "2024-09-25T12:05:42.579228Z",
          "quickbooks_errors": null,
          "updated_at": "2024-09-25T12:07:51.459935Z",
          "workspace": 530,
          "expense_group": 16081,
          "bill": null,
          "cheque": null,
          "journal_entry": null,
          "credit_card_purchase": null,
          "qbo_expense": null,
          "bill_payment": null
      }
  ]
};

export const mockQBOTasks = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { id: 1, status: TaskLogState.COMPLETE, type: QBOTaskLogType.CREATING_BILL, expense_group: 1 },
    { id: 2, status: TaskLogState.FAILED, type: QBOTaskLogType.CREATING_BILL, expense_group: 2 }
  ]
};

export const mockAccountingExportSummary = {
  id: 1,
  last_exported_at: '2023-01-01T00:00:00Z',
  next_export_at: '2023-01-02T00:00:00Z',
  export_mode: 'AUTO',
  total_accounting_export_count: 10,
  successful_accounting_export_count: 8,
  failed_accounting_export_count: 2,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  workspace: 1,
  repurposed_last_exported_at: '2023-01-01T00:00:00Z',
  repurposed_successful_count: 8,
  repurposed_failed_count: 2
};

export const mockExportDetails = {
  "id": 435,
  "last_exported_at": "2024-09-25T12:05:42.308142Z",
  "next_export_at": null,
  "export_mode": "MANUAL",
  "total_expense_groups_count": 25,
  "successful_expense_groups_count": 13,
  "failed_expense_groups_count": 12,
  "created_at": "2024-09-17T11:20:30.969195Z",
  "updated_at": "2024-09-25T12:08:26.662418Z",
  "workspace": 530
};

export const mockWorkspaceGeneralSettingsForDashboard = {
  import_items: true,
  employee_field_mapping: 'EMPLOYEE'
};

export const mockExportSettingsForDashboard = {
  workspace_general_settings: {
    reimbursable_expenses_object: 'BILL',
    corporate_credit_card_expenses_object: 'CREDIT_CARD_PURCHASE'
  },
  expense_group_settings: {
    expense_state: 'PAID',
    ccc_expense_state: 'PAID'
  }
};

export const mockImportSettingsForDashboard = {
  workspace_general_settings: {
    import_code_fields: ['ACCOUNT']
  }
};

export const mockQBOEnqueuedTaskResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      status: TaskLogState.ENQUEUED,
      type: QBOTaskLogType.CREATING_BILL,
      expense_group: 1
    },
    {
      id: 2,
      status: TaskLogState.ENQUEUED,
      type: QBOTaskLogType.CREATING_EXPENSE,
      expense_group: 2
    }
  ]
};

export const mockQBOCompletedTaskResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      status: TaskLogState.COMPLETE,
      type: QBOTaskLogType.CREATING_BILL,
      expense_group: 1
    },
    {
      id: 2,
      status: TaskLogState.COMPLETE,
      type: QBOTaskLogType.CREATING_EXPENSE,
      expense_group: 2
    }
  ]
};

export const mockExpenseGroupResponse: ExpenseGroupResponse = {
  count: 3,
  next: "http://quickbooks-api.staging-integrations:8000/api/workspaces/454/fyle/expense_groups/?limit=50&offset=50&tasklog__status=COMPLETE",
  previous: null,
  results: [
    {
      id: 13501,
      expenses: [
        {
          id: 1,
          employee_email: "user6@fyleforgotham.in",
          employee_name: "Victor Martinez",
          category: "Office Party",
          sub_category: "Food",
          project: "Project X",
          expense_id: "txtxDAMBtJbP",
          org_id: "or79Cob97KSh",
          expense_number: "E/2021/04/T/442",
          claim_number: "C/2021/04/R/47",
          amount: 444.0,
          currency: "USD",
          foreign_amount: 444.0,
          foreign_currency: "USD",
          tax_amount: 0,
          tax_group_id: "NON",
          settlement_id: "stlA1B2C3",
          reimbursable: false,
          billable: false,
          state: "PAYMENT_PROCESSING",
          vendor: "Uber#23",
          cost_center: "Marketing",
          purpose: "Team lunch",
          report_id: "rpcO7sDf1lGc",
          spent_at: new Date("2021-04-12T00:00:00Z"),
          approved_at: new Date("2021-04-13T10:00:00Z"),
          posted_at: new Date("2021-04-14T09:00:00Z"),
          expense_created_at: new Date("2021-04-12T12:00:00Z"),
          expense_updated_at: new Date("2021-04-13T11:00:00Z"),
          created_at: new Date("2024-02-23T05:30:21.320794Z"),
          updated_at: new Date("2024-02-23T05:30:21.320794Z"),
          fund_source: "CCC",
          verified_at: new Date("2021-04-13T09:00:00Z"),
          custom_properties: [
            {
              name: "Department",
              value: "Sales"
            }
          ],
          paid_on_sage_intacct: false,
          file_ids: ["file123", "file456"],
          payment_number: "P/2021/04/R/16",
          corporate_card_id: "card789",
          is_skipped: false,
          report_title: "April Team Lunch"
        }
      ],
      fund_source: "CCC",
      description: {
        expense_id: "txtxDAMBtJbP",
        employee_email: "user6@fyleforgotham.in",
        claim_number: "",
        report_id: "",
        settlement_id: ""
      },
      response_logs: {
        time: "2024-02-29T02:51:12.790-08:00",
        Purchase: {
          Id: "8154",
          Line: [
            {
              Id: "1",
              Amount: 444.0,
              DetailType: "AccountBasedExpenseLineDetail",
              Description: "user6@fyleforgotham.in - Office Party - 2021-04-12 - C/2021/04/R/47 -  - https://staging1.fyle.tech/app/admin/#/enterprise/view_expense/txtxDAMBtJbP?org_id=or79Cob97KSh",
              AccountBasedExpenseLineDetail: {
                AccountRef: {
                  name: "3519 Office Party",
                  value: "115"
                },
                TaxCodeRef: {
                  value: "NON"
                },
                BillableStatus: "NotBillable"
              }
            }
          ],
          Credit: false,
          domain: "QBO",
          sparse: false,
          TxnDate: "2021-04-12",
          MetaData: {
            CreateTime: "2024-02-29T02:51:13-08:00",
            LastUpdatedTime: "2024-02-29T02:51:13-08:00"
          },
          TotalAmt: 444.0,
          DocNumber: "E/2021/04/T/442",
          EntityRef: {
            name: "Uber#23",
            type: "Vendor",
            value: "187"
          },
          SyncToken: "0",
          AccountRef: {
            name: "QBO CCC Support Account",
            value: "130"
          },
          PurchaseEx: {
            any: [
              {
                nil: false,
                name: "{http://schema.intuit.com/finance/v3}NameValue",
                scope: "javax.xml.bind.JAXBElement$GlobalScope",
                value: {
                  Name: "TxnType",
                  Value: "54"
                },
                globalScope: true,
                declaredType: "com.intuit.schema.finance.v3.NameValue",
                typeSubstituted: false
              }
            ]
          },
          CurrencyRef: {
            name: "United States Dollar",
            value: "USD"
          },
          CustomField: [],
          PaymentType: "CreditCard",
          PrivateNote: "Credit card expense by user6@fyleforgotham.in spent on merchant Uber#23 on 2021-04-12"
        }
      },
      employee_name: "Victor Martinez",
      export_url: "https://c50.sandbox.qbo.intuit.com/app/expense?txnId=8154",
      created_at: new Date("2024-02-23T05:30:22.549675Z"),
      exported_at: new Date("2024-02-29T10:51:13.043901Z"),
      updated_at: new Date("2024-02-29T10:51:13.044005Z"),
      workspace: 454,
      export_type: ""
    },
    {
      id: 13500,
      expenses: [
        {
          id: 2,
          employee_email: "user6@fyleforgotham.in",
          employee_name: "Victor Martinez",
          category: "Unspecified",
          sub_category: "Meals",
          project: "Project Y",
          expense_id: "txT4JbfgtooE",
          org_id: "or79Cob97KSh",
          expense_number: "E/2021/04/T/405",
          claim_number: "C/2021/04/R/46",
          amount: -233.0,
          currency: "USD",
          foreign_amount: -233.0,
          foreign_currency: "USD",
          tax_amount: 0,
          tax_group_id: "NON",
          settlement_id: "stlD4E5F6",
          reimbursable: false,
          billable: false,
          state: "PAYMENT_PROCESSING",
          vendor: "STEAK-N-SHAKE#0664",
          cost_center: "Operations",
          purpose: "Team dinner",
          report_id: "rpIbJEjxy8K2",
          spent_at: new Date("2021-03-09T00:00:00Z"),
          approved_at: new Date("2021-03-10T10:00:00Z"),
          posted_at: new Date("2021-03-11T09:00:00Z"),
          expense_created_at: new Date("2021-03-09T12:00:00Z"),
          expense_updated_at: new Date("2021-03-10T11:00:00Z"),
          created_at: new Date("2024-02-23T05:30:21.564674Z"),
          updated_at: new Date("2024-02-23T05:30:21.564674Z"),
          fund_source: "CCC",
          verified_at: new Date("2021-03-10T09:00:00Z"),
          custom_properties: [
            {
              name: "Department",
              value: "Engineering"
            }
          ],
          paid_on_sage_intacct: false,
          file_ids: ["file789", "file012"],
          payment_number: "P/2021/04/R/15",
          corporate_card_id: "card012",
          is_skipped: false,
          report_title: "March Team Dinner"
        }
      ],
      fund_source: "CCC",
      description: {
        expense_id: "txT4JbfgtooE",
        employee_email: "user6@fyleforgotham.in",
        claim_number: "",
        report_id: "",
        settlement_id: ""
      },
      response_logs: {
        time: "2024-02-29T02:51:07.625-08:00",
        Purchase: {
          Id: "8153",
          Line: [
            {
              Id: "1",
              Amount: 233.0,
              DetailType: "AccountBasedExpenseLineDetail",
              Description: "user6@fyleforgotham.in - Unspecified - 2021-03-09 - C/2021/04/R/46 - DUNKIN #3513 (Card Transaction) - https://staging1.fyle.tech/app/admin/#/enterprise/view_expense/txT4JbfgtooE?org_id=or79Cob97KSh",
              AccountBasedExpenseLineDetail: {
                AccountRef: {
                  name: "2526 Unspecified",
                  value: "122"
                },
                TaxCodeRef: {
                  value: "NON"
                },
                BillableStatus: "NotBillable"
              }
            }
          ],
          Credit: true,
          domain: "QBO",
          sparse: false,
          TxnDate: "2021-03-09",
          MetaData: {
            CreateTime: "2024-02-29T02:51:08-08:00",
            LastUpdatedTime: "2024-02-29T02:51:08-08:00"
          },
          TotalAmt: 233.0,
          DocNumber: "E/2021/04/T/405",
          EntityRef: {
            name: "STEAK-N-SHAKE#0664",
            type: "Vendor",
            value: "101"
          },
          SyncToken: "0",
          AccountRef: {
            name: "QBO CCC Support Account",
            value: "130"
          },
          PurchaseEx: {
            any: [
              {
                nil: false,
                name: "{http://schema.intuit.com/finance/v3}NameValue",
                scope: "javax.xml.bind.JAXBElement$GlobalScope",
                value: {
                  Name: "TxnType",
                  Value: "11"
                },
                globalScope: true,
                declaredType: "com.intuit.schema.finance.v3.NameValue",
                typeSubstituted: false
              }
            ]
          },
          CurrencyRef: {
            name: "United States Dollar",
            value: "USD"
          },
          CustomField: [],
          PaymentType: "CreditCard",
          PrivateNote: "Credit card expense by user6@fyleforgotham.in spent on merchant STEAK-N-SHAKE#0664 on 2021-03-09"
        }
      },
      employee_name: "Victor Martinez",
      export_url: "https://c50.sandbox.qbo.intuit.com/app/creditcardcredit?txnId=8153",
      created_at: new Date("2024-02-23T05:30:22.546524Z"),
      exported_at: new Date("2024-02-29T10:51:07.929285Z"),
      updated_at: new Date("2024-02-29T10:51:07.929393Z"),
      workspace: 454,
      export_type: ""
    },
    {
      id: 13502,
      expenses: [
        {
          id: 3,
          employee_email: "user7@fyleforgotham.in",
          employee_name: "Alice Johnson",
          category: "Office Supplies",
          sub_category: "Stationery",
          project: "Project Z",
          expense_id: "txAB5678efgh",
          org_id: "or79Cob97KSh",
          expense_number: "E/2021/05/T/501",
          claim_number: "C/2021/05/R/48",
          amount: 150.75,
          currency: "USD",
          foreign_amount: 150.75,
          foreign_currency: "USD",
          tax_amount: 10.5,
          tax_group_id: "TAX",
          settlement_id: "stlG7H8I9",
          reimbursable: true,
          billable: true,
          state: "PAYMENT_PROCESSING",
          vendor: "Office Supplies Inc.",
          cost_center: "Administration",
          purpose: "Office supplies purchase",
          report_id: "rpXY1234abcd",
          spent_at: new Date("2021-05-15T00:00:00Z"),
          approved_at: new Date("2021-05-16T10:00:00Z"),
          posted_at: new Date("2021-05-17T09:00:00Z"),
          expense_created_at: new Date("2021-05-15T12:00:00Z"),
          expense_updated_at: new Date("2021-05-16T11:00:00Z"),
          created_at: new Date("2024-02-24T10:15:30.123456Z"),
          updated_at: new Date("2024-02-24T10:15:30.123456Z"),
          fund_source: "PERSONAL",
          verified_at: new Date("2021-05-16T09:00:00Z"),
          custom_properties: [
            {
              name: "Department",
              value: "Admin"
            }
          ],
          paid_on_sage_intacct: false,
          file_ids: ["file345", "file678"],
          payment_number: "P/2021/05/R/17",
          corporate_card_id: "anish",
          is_skipped: false,
          report_title: "May Office Supplies"
        }
      ],
      fund_source: "PERSONAL",
      description: {
        expense_id: "txAB5678efgh",
        employee_email: "user7@fyleforgotham.in",
        claim_number: "",
        report_id: "",
        settlement_id: ""
      },
      response_logs: {
        time: "2024-02-29T05:30:45.123-08:00",
        Bill: {
          Id: "8155",
          Line: [
            {
              Id: "1",
              Amount: 150.75,
              DetailType: "AccountBasedExpenseLineDetail",
              Description: "user7@fyleforgotham.in - Office Supplies - 2021-05-15 - C/2021/05/R/48 - Office Supplies Inc. - https://staging1.fyle.tech/app/admin/#/enterprise/view_expense/txAB5678efgh?org_id=or79Cob97KSh",
              AccountBasedExpenseLineDetail: {
                AccountRef: {
                  name: "6010 Office Supplies",
                  value: "116"
                },
                TaxCodeRef: {
                  value: "TAX"
                },
                BillableStatus: "Billable"
              }
            }
          ],
          domain: "QBO",
          sparse: false,
          TxnDate: "2021-05-15",
          MetaData: {
            CreateTime: "2024-02-29T05:30:46-08:00",
            LastUpdatedTime: "2024-02-29T05:30:46-08:00"
          },
          TotalAmt: 150.75,
          DocNumber: "E/2021/05/T/501",
          VendorRef: {
            name: "Alice Johnson",
            value: "102"
          },
          SyncToken: "0",
          CurrencyRef: {
            name: "United States Dollar",
            value: "USD"
          },
          CustomField: [],
          PrivateNote: "Reimbursable expense by user7@fyleforgotham.in spent on vendor Office Supplies Inc. on 2021-05-15"
        }
      },
      employee_name: "Alice Johnson",
      export_url: "https://c50.sandbox.qbo.intuit.com/app/bill?txnId=8155",
      created_at: new Date("2024-02-24T10:15:30.123456Z"),
      exported_at: new Date("2024-02-29T13:30:45.678901Z"),
      updated_at: new Date("2024-02-29T13:30:45.678901Z"),
      workspace: 454,
      export_type: ""
    }
  ]
};

export const mockSkippedExpenseGroup: SkipExportLogResponse = {
  count: 4,
  next: "http://quickbooks-api.staging-integrations:8000/api/workspaces/454/fyle/expenses/?is_skipped=true&limit=50&offset=50&org_id=or79Cob97KSh",
  previous: null,
  results: [
    {
      updated_at: new Date("2024-02-23T05:30:21.570820Z"),
      claim_number: "C/2022/04/R/9",
      employee_email: "ashwin.t@fyle.in",
      employee_name: "Ashwin",
      fund_source: "CCC",
      expense_id: "txuPPcLBZhYW",
      org_id: "or79Cob97KSh"
    },
    {
      updated_at: new Date("2024-02-23T05:30:21.564674Z"),
      claim_number: "C/2021/04/R/46",
      employee_email: "user6@fyleforgotham.in",
      employee_name: "Victor Martinez",
      fund_source: "CCC",
      expense_id: "txT4JbfgtooE",
      org_id: "or79Cob97KSh"
    },
    {
      updated_at: new Date("2024-02-23T05:30:21.248800Z"),
      claim_number: "C/2022/04/R/30",
      employee_email: "ashwin.t@fyle.in",
      employee_name: "Ashwin",
      fund_source: "CCC",
      expense_id: "txYQYWA1c6bU",
      org_id: "or79Cob97KSh"
    },
    {
      updated_at: new Date("2024-02-23T05:30:21.240046Z"),
      claim_number: "C/2022/08/R/22",
      employee_email: "ashwin.t@fyle.in",
      employee_name: "Ashwin",
      fund_source: "CCC",
      expense_id: "txyBQM9yIC9J",
      org_id: "or79Cob97KSh"
    }
  ]
};

export const mockSkippedExpenseGroupWithDateRange: SkipExportLogResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      updated_at: new Date("2023-06-15T10:30:00.000Z"),
      claim_number: "C/2023/06/R/1",
      employee_email: "john.doe@example.com",
      employee_name: "John Doe",
      fund_source: "PERSONAL",
      expense_id: "txABC123",
      org_id: "or79Cob97KSh"
    },
    {
      updated_at: new Date("2023-06-16T14:45:00.000Z"),
      claim_number: "C/2023/06/R/2",
      employee_email: "jane.smith@example.com",
      employee_name: "Jane Smith",
      fund_source: "CCC",
      expense_id: "txDEF456",
      org_id: "or79Cob97KSh"
    }
  ]
};

export const mockPaginator: Paginator = {
  limit: 50,
  offset: 0
};

export const mockUserProfile = {
  org_id: 'or79Cob97KSh',
  email: 'test@example.com',
  access_token: 'dummy_access_token',
  refresh_token: 'dummy_refresh_token',
  full_name: 'Test User',
  user_id: 'user123',
  org_name: 'Test Org'
};

// Fixtures for Mapping Pages
export const mockGeneralSettingsForMapping = {
  "id": 684,
  "reimbursable_expenses_object": "JOURNAL ENTRY",
  "corporate_credit_card_expenses_object": "BILL",
  "employee_field_mapping": "VENDOR",
  "map_merchant_to_vendor": true,
  "import_categories": true,
  "import_items": false,
  "import_projects": false,
  "import_tax_codes": false,
  "change_accounting_period": false,
  "charts_of_accounts": [
      "Expense"
  ],
  "memo_structure": [
      "employee_email",
      "purpose",
      "category",
      "spent_on",
      "report_number",
      "expense_link"
  ],
  "auto_map_employees": "NAME",
  "auto_create_destination_entity": false,
  "auto_create_merchants_as_vendors": false,
  "sync_fyle_to_qbo_payments": false,
  "sync_qbo_to_fyle_payments": true,
  "category_sync_version": "v2",
  "je_single_credit_line": false,
  "map_fyle_cards_qbo_account": false,
  "import_vendors_as_merchants": false,
  "is_multi_currency_allowed": false,
  "name_in_journal_entry": "EMPLOYEE",
  "import_code_fields": [],
  "created_at": "2024-08-22T08:50:29.978051Z",
  "updated_at": "2024-09-24T18:28:10.411535Z",
  "workspace": 512
};

export const mockMappingSettings = {
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
      {
          "id": 3006,
          "source_field": "CATEGORY",
          "destination_field": "ACCOUNT",
          "import_to_fyle": false,
          "is_custom": false,
          "source_placeholder": null,
          "created_at": "2024-08-22T08:50:50.425404Z",
          "updated_at": "2024-08-28T07:50:45.557168Z",
          "expense_field": null,
          "workspace": 512
      }
  ]
};

export const paginatedDestAttribsForMapping = {
  "count": 3,
  "next": "http://quickbooks-api.staging-integrations:8000/api/workspaces/512/mappings/paginated_destination_attributes/?active=true&attribute_type=VENDOR&limit=100&offset=100",
  "previous": null,
  "results": [
      {
          "id": 253195,
          "attribute_type": "VENDOR",
          "display_name": "vendor",
          "value": "1",
          "destination_id": "215",
          "auto_created": false,
          "active": true,
          "detail": {
              "email": null,
              "currency": "USD"
          },
          "code": null,
          "created_at": "2024-08-22T06:44:16.926440Z",
          "updated_at": "2024-08-22T06:44:16.926468Z",
          "workspace": 512
      },
      {
          "id": 253198,
          "attribute_type": "VENDOR",
          "display_name": "vendor",
          "value": "Abhishek 2",
          "destination_id": "146",
          "auto_created": false,
          "active": true,
          "detail": {
              "email": null,
              "currency": "USD"
          },
          "code": null,
          "created_at": "2024-08-22T06:44:16.926600Z",
          "updated_at": "2024-08-22T06:44:16.926609Z",
          "workspace": 512
      },
      {
          "id": 253199,
          "attribute_type": "VENDOR",
          "display_name": "vendor",
          "value": "Abhishek ji",
          "destination_id": "167",
          "auto_created": false,
          "active": true,
          "detail": {
              "email": null,
              "currency": "USD"
          },
          "code": null,
          "created_at": "2024-08-22T06:44:16.926648Z",
          "updated_at": "2024-08-22T06:44:16.926654Z",
          "workspace": 512
      }
  ]
};

export const mockemployeeAttributes = {
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
      {
          "id": 1456114,
          "employeemapping": [],
          "attribute_type": "EMPLOYEE",
          "display_name": "Employee",
          "value": "aadams@efficientoffice.com",
          "source_id": "ouNnLODE2MhX",
          "auto_mapped": false,
          "auto_created": false,
          "active": true,
          "detail": {
              "user_id": "usAwZNxzZENS",
              "location": null,
              "full_name": "Ashley Adams",
              "department": "Human Resources",
              "department_id": "deptMLvcJapilU",
              "employee_code": "5",
              "department_code": null
          },
          "created_at": "2024-08-22T06:42:43.482374Z",
          "updated_at": "2024-08-22T06:42:43.482383Z",
          "workspace": 512
      },
      {
          "id": 1456123,
          "employeemapping": [],
          "attribute_type": "EMPLOYEE",
          "display_name": "Employee",
          "value": "aaron@efficientoffice.com",
          "source_id": "ouh8MSWBpWJI",
          "auto_mapped": false,
          "auto_created": false,
          "active": true,
          "detail": {
              "user_id": "usA8hk3BOIX7",
              "location": null,
              "full_name": "Aaron Eckerly",
              "department": "Customer Success",
              "department_id": "dept6rVZn3smSh",
              "employee_code": "35",
              "department_code": null
          },
          "created_at": "2024-08-22T06:42:43.482800Z",
          "updated_at": "2024-08-22T06:42:43.482808Z",
          "workspace": 512
      },
      {
          "id": 1456122,
          "employeemapping": [],
          "attribute_type": "EMPLOYEE",
          "display_name": "Employee",
          "value": "abhisheksingh@prod.com",
          "source_id": "ouTBfIlGoZCL",
          "auto_mapped": false,
          "auto_created": false,
          "active": true,
          "detail": {
              "user_id": "usGdQoFQWiEs",
              "location": null,
              "full_name": "Abhishek Singh",
              "department": "Human Resources",
              "department_id": "deptMLvcJapilU",
              "employee_code": "112",
              "department_code": null
          },
          "created_at": "2024-08-22T06:42:43.482753Z",
          "updated_at": "2024-08-22T06:42:43.482762Z",
          "workspace": 512
      }
  ]
};

export const mockMappingStats = {"all_attributes_count": 105, "unmapped_attributes_count": 92};

export const mockMappingSetting: MappingSetting[] = [
  {
    source_field: 'VENDOR',
    destination_field: AccountingField.ACCOUNT,
    id: 0,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 0,
    import_to_fyle: false,
    is_custom: false,
    source_placeholder: null
  }
];

export const mockPageSize = { limit: 10, offset: 0 };
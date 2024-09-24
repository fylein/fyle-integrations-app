import { MinimalUser } from "src/app/core/models/db/user.model";
import { AutoMapEmployeeOptions, EmployeeFieldMapping, CCCExpenseState, ExpenseState, ExportDateType, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOOnboardingState, SplitExpenseGrouping, QBOReimbursableExpensesObject, QboExportSettingDestinationOptionKey } from "src/app/core/models/enum/enum.model";
import { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from "src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model";
import { PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { SelectFormOption } from "src/app/core/models/common/select-form-option.model";
import { ExportSettingOptionSearch } from "src/app/core/models/common/export-settings.model";

export const mockUser: MinimalUser = {
    org_id: '123',
    email: 'test@example.com',
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    full_name: 'Test User',
    user_id: 'user123',
    org_name: 'Test Org'
};

export const testOnboardingState = [
  { state: QBOOnboardingState.CONNECTION, route: '/integrations/qbo/onboarding/landing' },
  { state: QBOOnboardingState.MAP_EMPLOYEES, route: '/integrations/qbo/onboarding/employee_settings' },
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
        "is_simplify_report_closure_enabled": true,
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
  employee_field_mapping: EmployeeFieldMapping.VENDOR,
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
  is_simplify_report_closure_enabled: true,
  category_sync_version: 'v2',
  je_single_credit_line: false,
  map_fyle_cards_qbo_account: false,
  skip_cards_mapping: false,
  import_vendors_as_merchants: false,
  is_multi_currency_allowed: false,
  is_tax_override_enabled: true,
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
      is_simplify_report_closure_enabled: true,
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

  export const mockSaveResponse = {
    "workspace_general_settings": {
        "reimbursable_expenses_object": "BILL",
        "corporate_credit_card_expenses_object": "BILL",
        "is_simplify_report_closure_enabled": true,
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
  destinationAttributes: []
};

export const mockExpenseAccountEvent: ExportSettingOptionSearch = {
  searchTerm: 'anish',
  destinationOptionKey: QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT,
  destinationAttributes: []
};

export const mockGeneralEvent: ExportSettingOptionSearch = {
  searchTerm: 'anish',
  destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
  destinationAttributes: []
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
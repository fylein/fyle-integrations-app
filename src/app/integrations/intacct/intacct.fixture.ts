import { minimalUser } from "src/app/core/interceptor/jwt.fixture";
import { AccountingExportSummary } from "src/app/core/models/db/accounting-export-summary.model";
import { Error } from "src/app/core/models/db/error.model";
import { MinimalUser } from "src/app/core/models/db/user.model";
import { AccountingErrorType, CCCExpenseState, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, FyleField, IntacctCorporateCreditCardExpensesObject, IntacctOnboardingState, IntacctReimbursableExpensesObject, SplitExpenseGrouping, TaskLogState, TaskLogType } from "src/app/core/models/enum/enum.model";
import { IntacctWorkspace } from "src/app/core/models/intacct/db/workspaces.model";
import { ExportSettingGet } from "src/app/core/models/intacct/intacct-configuration/export-settings.model";
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { SkipExportLogResponse } from "src/app/core/models/intacct/db/expense-group.model";
import { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
import { DependentFieldSetting, ImportSettingGet, MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { LocationEntityMapping } from 'src/app/core/models/intacct/db/location-entity-mapping.model';
import { GroupedDestinationAttribute, IntacctDestinationAttribute } from "src/app/core/models/intacct/db/destination-attribute.model";
import { IntacctConfiguration } from "src/app/core/models/db/configuration.model";
import { AdvancedSettingsGet, Configuration } from "src/app/core/models/intacct/intacct-configuration/advanced-settings.model";
import { EmailOption } from "src/app/core/models/common/advanced-settings.model";

export const workspaceResponse: IntacctWorkspace[] = [{
    "id": 1,
    "name": "Halo Org",
    "org_id": "orHVw3iaexgg",
    "currency": "EUR",
    "destination_synced_at": new Date("2023-06-23T05:37:56.907997Z"),
    "ccc_last_synced_at": new Date("2023-06-23T05:37:56.907997Z"),
    "onboarding_state": IntacctOnboardingState.CONNECTION,
    "created_at": new Date("2023-06-23T05:37:56.907997Z"),
    "updated_at": new Date("2023-06-23T05:37:56.907997Z"),
    "user": [1],
    "last_synced_at": new Date("2023-06-23T05:37:56.907997Z"),
    "source_synced_at": new Date("2023-06-23T05:37:56.907997Z"),
    "cluster_domain": 'string'
  }];

  export const errorResponse = {
    status: 404,
    statusText: "Not Found",
    error: {
      id: 1,
      is_expired: true,
      company_name: 'Halo MasterChief'
    }
};

export const mockUser: MinimalUser = {
  ...minimalUser,
  org_id: 'mock org id'
};

export const testOnboardingState: {[k in IntacctOnboardingState]: string} =  {
  [IntacctOnboardingState.CONNECTION]: '/integrations/intacct/onboarding/landing',
  [IntacctOnboardingState.LOCATION_ENTITY]: '/integrations/intacct/onboarding/connector',
  [IntacctOnboardingState.EXPORT_SETTINGS]: '/integrations/intacct/onboarding/export_settings',
  [IntacctOnboardingState.IMPORT_SETTINGS]: '/integrations/intacct/onboarding/import_settings',
  [IntacctOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/intacct/onboarding/advanced_settings',
  [IntacctOnboardingState.COMPLETE]: '/integrations/intacct/main/dashboard'
};

export const mockTasksInProgress = {
  results: [
    { status: TaskLogState.COMPLETE, type: TaskLogType.CREATING_BILLS, expense_group: 1 },
    { status: TaskLogState.IN_PROGRESS, type: TaskLogType.CREATING_BILLS, expense_group: 2 }
  ]
};


export const mockCompletedTasksWithFailures = {
  results: [
    { status: TaskLogState.COMPLETE, type: TaskLogType.CREATING_BILLS, expense_group: 1 },
    { status: TaskLogState.FAILED, type: TaskLogType.CREATING_BILLS, expense_group: 2 }
  ]
};

export const mockExportSettingGet: ExportSettingGet = {
  "configurations": {
      "reimbursable_expenses_object": IntacctReimbursableExpensesObject.BILL,
      "corporate_credit_card_expenses_object": IntacctCorporateCreditCardExpensesObject.EXPENSE_REPORT,
      "auto_map_employees": "NAME",
      "employee_field_mapping": "EMPLOYEE",
      "use_merchant_in_journal_line": false
  },
  "expense_group_settings": {
      "reimbursable_expense_group_fields": [
          "claim_number",
          "employee_email",
          "fund_source",
          "report_id"
      ],
      "reimbursable_export_date_type": ExportDateType.CURRENT_DATE,
      "expense_state": ExpenseState.PAYMENT_PROCESSING,
      "corporate_credit_card_expense_group_fields": [
          "fund_source",
          "employee_email",
          "expense_id",
          "expense_number",
          "spent_at"
      ],
      "ccc_export_date_type": ExportDateType.SPENT_AT,
      "ccc_expense_state": CCCExpenseState.PAID,
      "split_expense_grouping": SplitExpenseGrouping.MULTIPLE_LINE_ITEM
  },
  "general_mappings": {
      "default_gl_account": {
          "id": null,
          "name": null
      },
      "default_credit_card": {
          "id": null,
          "name": null
      },
      "default_charge_card": {
          "id": null,
          "name": null
      },
      "default_reimbursable_expense_payment_type": {
          "id": null,
          "name": null
      },
      "default_ccc_expense_payment_type": {
          "id": "8",
          "name": "Chase Bank"
      },
      "default_ccc_vendor": {
          "id": null,
          "name": null
      }
  },
  "workspace_id": 309
};


export const mockExportDetails: AccountingExportSummary = {
  "id": 160,
  "last_exported_at": "2024-07-11T08:07:09.848044Z",
  "next_export_at": "",
  "export_mode": "MANUAL",
  "created_at": "2023-09-29T11:55:35.676822Z",
  "updated_at": "2024-07-11T08:07:22.395524Z",
  "workspace": 309,
  total_accounting_export_count: 0,
  successful_accounting_export_count: 0,
  failed_accounting_export_count: 0,
  repurposed_last_exported_at: "2024-08-28T17:11:21.098195Z",
  repurposed_successful_count: 0,
  repurposed_failed_count: 29
};

export const mockTasks = {
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
      {
          "id": 9287,
          "type": "CREATING_CHARGE_CARD_TRANSACTIONS",
          "task_id": null,
          "supdoc_id": null,
          "status": "COMPLETE",
          "detail": {
              "key": "225351",
              "status": "success",
              "url_id": "qXWaCK6f5_qV4aHm6u3PiIeh8ogPEuqB6MjqAbzQVGQ",
              "function": "record_cctransaction",
              "controlid": "58251c29-1e0f-4928-86d6-d6d1bbdb4edb"
          },
          "sage_intacct_errors": null,
          "created_at": "2024-07-11T08:07:09.864962Z",
          "updated_at": "2024-07-11T08:07:21.798373Z",
          "workspace": 309,
          "expense_group": 7542,
          "bill": null,
          "expense_report": null,
          "charge_card_transaction": 90843,
          "journal_entry": null,
          "ap_payment": null,
          "sage_intacct_reimbursement": null
      },
      {
          "id": 9069,
          "type": "CREATING_CHARGE_CARD_TRANSACTIONS",
          "task_id": null,
          "supdoc_id": null,
          "status": "COMPLETE",
          "detail": {
              "key": "223630",
              "status": "success",
              "url_id": "qXWaCK6f5_qV4aHm6u3PiLvFSqblKp1NRLeOkn9AajA",
              "function": "record_cctransaction",
              "controlid": "bd160ada-5051-4d2c-9edb-3a78a27c4799"
          },
          "sage_intacct_errors": null,
          "created_at": "2024-05-22T13:30:24.795959Z",
          "updated_at": "2024-05-23T08:04:27.992025Z",
          "workspace": 309,
          "expense_group": 7310,
          "bill": null,
          "expense_report": null,
          "charge_card_transaction": 90705,
          "journal_entry": null,
          "ap_payment": null,
          "sage_intacct_reimbursement": null
      },
      {
          "id": 9070,
          "type": "CREATING_CHARGE_CARD_TRANSACTIONS",
          "task_id": null,
          "supdoc_id": "7341",
          "status": "COMPLETE",
          "detail": {
              "key": "223610",
              "status": "success",
              "url_id": "qXWaCK6f5_qV4aHm6u3PiJU3ZRrpBmI3o1E1U_b8XPU",
              "function": "record_cctransaction",
              "controlid": "12e78bb4-9da9-4906-bb25-5ba38937ac98"
          },
          "sage_intacct_errors": null,
          "created_at": "2024-05-22T13:30:24.822472Z",
          "updated_at": "2024-05-22T14:04:56.668057Z",
          "workspace": 309,
          "expense_group": 7341,
          "bill": null,
          "expense_report": null,
          "charge_card_transaction": 90704,
          "journal_entry": null,
          "ap_payment": null,
          "sage_intacct_reimbursement": null
      },
      {
          "id": 8153,
          "type": "CREATING_EXPENSE_REPORTS",
          "task_id": null,
          "supdoc_id": null,
          "status": "COMPLETE",
          "detail": {
              "key": "209973",
              "url_id": "G-ux6pWcr8AhwLamSloWEE2iCi9ieG24GsfBYIQxAbA"
          },
          "sage_intacct_errors": null,
          "created_at": "2023-09-29T12:12:51.475099Z",
          "updated_at": "2024-02-12T05:21:06.660047Z",
          "workspace": 309,
          "expense_group": 5999,
          "bill": null,
          "expense_report": 135126,
          "charge_card_transaction": null,
          "journal_entry": null,
          "ap_payment": null,
          "sage_intacct_reimbursement": null
      }
  ]
};

export const mockExportableAccountingExportIds = {
  exportable_expense_group_ids: [1, 2, 3]
};

export const mockConfiguration = {
  "id": 329,
  "workspace": "Workspace object (309)",
  "employee_field_mapping": "EMPLOYEE",
  "reimbursable_expenses_object": "BILL",
  "corporate_credit_card_expenses_object": "EXPENSE_REPORT",
  "import_projects": false,
  "import_categories": true,
  "sync_fyle_to_sage_intacct_payments": false,
  "sync_sage_intacct_to_fyle_payments": true,
  "auto_map_employees": "NAME",
  "import_tax_codes": false,
  "memo_structure": [
      "employee_email",
      "category",
      "spent_on",
      "report_number",
      "purpose",
      "expense_link"
  ],
  "auto_create_destination_entity": true,
  "is_journal_credit_billable": true,
  "change_accounting_period": true,
  "import_vendors_as_merchants": true,
  "use_merchant_in_journal_line": false,
  "auto_create_merchants_as_vendors": false,
  "je_single_credit_line": false,
  "import_code_fields": [
      "_EXPENSE_TYPE",
      "_ACCOUNT"
  ],
  "created_at": "2023-09-29T11:59:03.359631Z",
  "updated_at": "2024-09-19T08:58:21.110832Z"
};

export const mockAccountingExportSummary = {
  "id": 46,
  "last_exported_at": "2024-08-28T17:11:21.098195Z",
  "next_export_at": "2024-02-24T17:11:14.033111Z",
  "export_mode": "MANUAL",
  "total_expense_groups_count": 29,
  "successful_expense_groups_count": 0,
  "failed_expense_groups_count": 29,
  "created_at": "2023-07-17T20:56:55.442251Z",
  "updated_at": "2024-09-11T10:08:20.636603Z",
  "workspace": 240,
  "repurposed_last_exported_at": "2024-08-28T17:11:21.098195Z",
  "repurposed_successful_count": 0,
  "repurposed_failed_count": 29
};


export const mockErrors = [
  { id: 1, type: AccountingErrorType.EMPLOYEE_MAPPING, error_title: 'Employee mapping error' },
  { id: 2, type: AccountingErrorType.CATEGORY_MAPPING, error_title: 'Category mapping error' },
  { id: 3, type: AccountingErrorType.ACCOUNTING_ERROR, error_title: 'Accounting error' }
] as Error[];

export const mockMappingSettingsResponse = {
  results: [
    { source_field: FyleField.EMPLOYEE, destination_field: 'EMPLOYEE' },
    { source_field: FyleField.CATEGORY, destination_field: 'EXPENSE_TYPE' },
    { source_field: 'PROJECT', destination_field: 'LOCATION' }
  ]
};

export const mockMappingSettingsWithCustomFieldResponse = {
  results: [
    { source_field: FyleField.EMPLOYEE, destination_field: 'EMPLOYEE' },
    { source_field: FyleField.CATEGORY, destination_field: 'EXPENSE_TYPE' },
    { source_field: 'PROJECT', destination_field: 'LOCATION' },
    { source_field: 'SAMPLE_CUSTOM_FIELD', destination_field: 'PROJECT' }
  ]
};

export const mockDimensionDetailsForFyleFields = {
  results: [
    { attribute_type: 'PROJECT', display_name: 'Project Display Name', source_type: 'FYLE' }
  ]
};

export const mockDimensionDetailsForAccountingFields = {
  results: [
    { attribute_type: 'EMPLOYEE', display_name: 'Employee', source_type: 'ACCOUNTING' },
    { attribute_type: 'EXPENSE_TYPE', display_name: 'Expense Type Display Name', source_type: 'ACCOUNTING' },
    { attribute_type: 'LOCATION', display_name: 'Location Display Name', source_type: 'ACCOUNTING' }
  ]
};

export const mockConfigurationResponse = {
  employee_field_mapping: 'EMPLOYEE',
  reimbursable_expenses_object: null,
  corporate_credit_card_expenses_object: 'JOURNAL_ENTRY',
  auto_map_employees: 'EMPLOYEE_CODE'
};

export const mockDestinationAttributesResponse = {
  results: [
    {
      id: 216107,
      attribute_type: 'EMPLOYEE',
      display_name: 'employee',
      value: 'Brian Foster',
      destination_id: 'Brian Foster'
    },
    {
      id: 216116,
      attribute_type: 'EMPLOYEE',
      display_name: 'employee',
      value: 'Chris Curtis',
      destination_id: 'Chris Curtis'
    }
  ]
};

export const mockExpenseGroupResponse: ExpenseGroupResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 7715,
      expenses: [
        {
          updated_at: new Date('2024-08-12T12:17:27.837958Z'),
          claim_number: 'C/2024/08/R/8',
          employee_email: 'ashwin.t@fyle.in',
          employee_name: 'Ashwin',
          fund_source: 'CCC',
          expense_number: 'E/2024/08/T/8',
          payment_number: 'P/2024/08/T/P/2024/08/R/7',
          category: 'ABN Withholding',
          amount: -460.0,
          expense_id: 'txPpUSwko5es'
        }
      ],
      description: {
        spent_at: new Date("2024-08-12T00:00:00"),
        expense_id: "txPpUSwko5es",
        fund_source: "CCC",
        employee_email: "ashwin.t@fyle.in"
      } as unknown as ExpenseGroupDescription,
      fund_source: 'CCC',
      export_type: 'CHARGE_CARD_TRANSACTION',
      exported_at: new Date('2024-08-27T16:51:07.206898Z'),
      employee_name: 'Ashwin',
      export_url: 'https://example.com/export/7715'
    },
    {
      id: 7714,
      expenses: [
        {
          updated_at: new Date('2024-08-12T12:17:27.698968Z'),
          claim_number: 'C/2024/08/R/9',
          employee_email: 'ashwin.t@fyle.in',
          employee_name: 'Ashwin',
          fund_source: 'CCC',
          expense_number: 'E/2024/08/T/9',
          payment_number: 'P/2024/08/T/P/2024/08/R/8',
          category: 'ABN Withholding',
          amount: -550.0,
          expense_id: 'txoerMCRLkJ4'
        }
      ],
      description: {
        spent_at: new Date("2024-08-12T00:00:00"),
        expense_id: "txPpUSwko5es",
        fund_source: "CCC",
        employee_email: "ashwin.t@fyle.in"
      } as unknown as ExpenseGroupDescription,
      fund_source: 'CCC',
      export_type: 'CHARGE_CARD_TRANSACTION',
      exported_at: new Date('2024-08-27T16:50:57.620969Z'),
      employee_name: 'Ashwin',
      export_url: 'https://example.com/export/7714'
    }
  ] as ExpenseGroup[]
};

export const mockSkipExportLogResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      expenses: [
        {
          updated_at: '2024-08-12T12:17:27.837958Z',
          claim_number: 'C/2024/08/R/8',
          employee_email: 'ashwin.t@fyle.in',
          employee_name: 'Ashwin',
          fund_source: 'CCC',
          expense_number: 'E/2024/08/T/8',
          category: 'ABN Withholding',
          amount: -460.0,
          expense_id: 'txPpUSwko5es'
        }
      ],
      fund_source: 'CCC',
      created_at: '2024-08-12T12:17:27.916749Z',
      updated_at: '2024-08-27T16:51:07.218092Z',
      workspace: 240
    },
    {
      id: 2,
      expenses: [
        {
          updated_at: '2024-08-12T12:17:27.698968Z',
          claim_number: 'C/2024/08/R/9',
          employee_email: 'ashwin.t@fyle.in',
          employee_name: 'Ashwin',
          fund_source: 'CCC',
          expense_number: 'E/2024/08/T/9',
          category: 'ABN Withholding',
          amount: -550.0,
          expense_id: 'txoerMCRLkJ4'
        }
      ],
      fund_source: 'CCC',
      created_at: '2024-08-12T12:17:27.903912Z',
      updated_at: '2024-08-27T16:50:57.633246Z',
      workspace: 240
    }
  ]
} as unknown as SkipExportLogResponse;

export const mockPaginator: Paginator = {
  limit: 50,
  offset: 0
};


export const mockExportSettings = {
  configurations: {
    reimbursable_expenses_object: IntacctReimbursableExpensesObject.EXPENSE_REPORT,
    corporate_credit_card_expenses_object: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION,
    employee_field_mapping: FyleField.EMPLOYEE,
    auto_map_employees: 'EMAIL',
    use_merchant_in_journal_line: true
  },
  expense_group_settings: {
    reimbursable_expense_group_fields: [ExpenseGroupingFieldOption.EXPENSE_ID],
    reimbursable_export_date_type: ExportDateType.CURRENT_DATE,
    expense_state: ExpenseState.PAYMENT_PROCESSING,
    corporate_credit_card_expense_group_fields: [ExpenseGroupingFieldOption.EXPENSE_ID],
    ccc_export_date_type: ExportDateType.SPENT_AT,
    ccc_expense_state: CCCExpenseState.PAID,
    split_expense_grouping: null
  },
  general_mappings: {
    default_gl_account: { id: '1', name: 'Account 1' },
    default_charge_card: { id: '2', name: 'Card 1' },
    default_reimbursable_expense_payment_type: { id: '3', name: 'Type 1' },
    default_ccc_expense_payment_type: { id: '4', name: 'Type 2' },
    default_ccc_vendor: { id: '5', name: 'Vendor 1' },
    default_credit_card: { id: '6', name: 'Credit Card 1' }
  },
  workspace_id: 1
} as unknown as ExportSettingGet;


export const mockPaginatedDestinationAttributes = {
  ACCOUNT: {
    "count": 4,
    "next": "http://intacct-api.staging-integrations:8000/api/workspaces/366/sage_intacct/paginated_destination_attributes/?attribute_type=ACCOUNT&limit=100&offset=100",
    "previous": null,
    "results": [
      {
        "id": 250084,
        "attribute_type": "ACCOUNT",
        "display_name": "account",
        "value": "Accounts Payable",
        "destination_id": "2000",
        "auto_created": false,
        "active": true,
        "detail": {
          "account_type": "balancesheet"
        },
        "code": "2000",
        "created_at": "2024-08-26T11:54:56.743019Z",
        "updated_at": "2024-09-23T08:32:57.719332Z",
        "workspace": 366
      },
      {
        "id": 250077,
        "attribute_type": "ACCOUNT",
        "display_name": "account",
        "value": "Accounts Receivable - trade",
        "destination_id": "1100",
        "auto_created": false,
        "active": true,
        "detail": {
          "account_type": "balancesheet"
        },
        "code": "1100",
        "created_at": "2024-08-26T11:54:56.737413Z",
        "updated_at": "2024-09-23T08:32:57.719266Z",
        "workspace": 366
      },
      {
        "id": 250078,
        "attribute_type": "ACCOUNT",
        "display_name": "account",
        "value": "Accounts Receivable - unbilled",
        "destination_id": "1110",
        "auto_created": false,
        "active": true,
        "detail": {
          "account_type": "balancesheet"
        },
        "code": "1110",
        "created_at": "2024-08-26T11:54:56.742752Z",
        "updated_at": "2024-09-23T08:32:57.719286Z",
        "workspace": 366
      },
      {
        "id": 249997,
        "attribute_type": "ACCOUNT",
        "display_name": "account",
        "value": "Accrued Bonus",
        "destination_id": "2022",
        "auto_created": false,
        "active": true,
        "detail": {
          "account_type": "balancesheet"
        },
        "code": "2022",
        "created_at": "2024-08-26T11:54:56.719668Z",
        "updated_at": "2024-09-23T08:32:57.718161Z",
        "workspace": 366
      }
    ]
  },
  EXPENSE_PAYMENT_TYPE: {
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 249873,
        "attribute_type": "EXPENSE_PAYMENT_TYPE",
        "display_name": "expense payment type",
        "value": "Elon Baba CCC",
        "destination_id": "2",
        "auto_created": false,
        "active": true,
        "detail": {
          "is_reimbursable": false
        },
        "code": null,
        "created_at": "2024-08-26T11:54:41.504318Z",
        "updated_at": "2024-08-26T11:54:41.504329Z",
        "workspace": 366
      },
      {
        "id": 249872,
        "attribute_type": "EXPENSE_PAYMENT_TYPE",
        "display_name": "expense payment type",
        "value": "Elon musk",
        "destination_id": "1",
        "auto_created": false,
        "active": true,
        "detail": {
          "is_reimbursable": true
        },
        "code": null,
        "created_at": "2024-08-26T11:54:41.504228Z",
        "updated_at": "2024-08-26T11:54:41.504262Z",
        "workspace": 366
      }
    ]
  },
  VENDOR: {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 249883,
        "attribute_type": "VENDOR",
        "display_name": "vendor",
        "value": "A-1 Electric Company",
        "destination_id": "V100",
        "auto_created": false,
        "active": true,
        "detail": {
          "email": null
        },
        "code": null,
        "created_at": "2024-08-26T11:54:51.315724Z",
        "updated_at": "2024-08-26T11:54:51.315731Z",
        "workspace": 366
      },
      {
        "id": 249886,
        "attribute_type": "VENDOR",
        "display_name": "vendor",
        "value": "AAA Insurance and Bonding",
        "destination_id": "V104",
        "auto_created": false,
        "active": true,
        "detail": {
          "email": "andree@abuckley.COM"
        },
        "code": null,
        "created_at": "2024-08-26T11:54:51.315883Z",
        "updated_at": "2024-08-26T11:54:51.315893Z",
        "workspace": 366
      },
      {
        "id": 249943,
        "attribute_type": "VENDOR",
        "display_name": "vendor",
        "value": "ABC Electric",
        "destination_id": "V164",
        "auto_created": false,
        "active": true,
        "detail": {
          "email": null
        },
        "code": null,
        "created_at": "2024-08-26T11:54:51.338322Z",
        "updated_at": "2024-08-26T11:54:51.338330Z",
        "workspace": 366
      },
      {
        "id": 249885,
        "attribute_type": "VENDOR",
        "display_name": "vendor",
        "value": "Ace Drywall",
        "destination_id": "V103",
        "auto_created": false,
        "active": true,
        "detail": {
          "email": null
        },
        "code": null,
        "created_at": "2024-08-26T11:54:51.315818Z",
        "updated_at": "2024-08-26T11:54:51.315827Z",
        "workspace": 366
      }
    ]
  },
  CHARGE_CARD_NUMBER: {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 249875,
        "attribute_type": "CHARGE_CARD_NUMBER",
        "display_name": "Charge Card Account",
        "value": "1234",
        "destination_id": "1234",
        "auto_created": false,
        "active": true,
        "detail": null,
        "code": null,
        "created_at": "2024-08-26T11:54:46.642086Z",
        "updated_at": "2024-08-26T11:54:46.642093Z",
        "workspace": 366
      },
      {
        "id": 249876,
        "attribute_type": "CHARGE_CARD_NUMBER",
        "display_name": "Charge Card Account",
        "value": "Mastercard - 6789",
        "destination_id": "Mastercard - 6789",
        "auto_created": false,
        "active": true,
        "detail": null,
        "code": null,
        "created_at": "2024-08-26T11:54:46.642117Z",
        "updated_at": "2024-08-26T11:54:46.642125Z",
        "workspace": 366
      },
      {
        "id": 249874,
        "attribute_type": "CHARGE_CARD_NUMBER",
        "display_name": "Charge Card Account",
        "value": "Nilesh Credit Card",
        "destination_id": "Nilesh Credit Card",
        "auto_created": false,
        "active": true,
        "detail": null,
        "code": null,
        "created_at": "2024-08-26T11:54:46.642035Z",
        "updated_at": "2024-08-26T11:54:46.642058Z",
        "workspace": 366
      },
      {
        "id": 249877,
        "attribute_type": "CHARGE_CARD_NUMBER",
        "display_name": "Charge Card Account",
        "value": "Visa - 1234",
        "destination_id": "Visa - 1234",
        "auto_created": false,
        "active": true,
        "detail": null,
        "code": null,
        "created_at": "2024-08-26T11:54:46.642147Z",
        "updated_at": "2024-08-26T11:54:46.642154Z",
        "workspace": 366
      }
    ]
  }
};

export const intacctImportCodeConfig = {
  PROJECT: true,
  DEPARTMENT: true,
  ACCOUNT: true,
  EXPENSE_TYPE: true
};

export const fyleFields = [
  {
    attribute_type: 'COST_CENTER',
    display_name: 'Cost Center',
    is_dependent: false
  },
  {
    attribute_type: 'PROJECT',
    display_name: 'Project',
    is_dependent: false
  }
] as ExpenseField[];

export const sageIntacctFields = [
  {
    attribute_type: 'CUSTOMER',
    display_name: 'Customer'
  },
  {
    attribute_type: 'ITEM',
    display_name: 'Item'
  },
  {
    attribute_type: 'PROJECT',
    display_name: 'Project'
  }
] as ExpenseField[];

export const importSettings = {
  configurations: {
    import_categories: false,
    import_tax_codes: false,
    import_vendors_as_merchants: false,
    import_code_fields: []
  },
  general_mappings: {
    default_tax_code: {
      name: null,
      id: null
    }
  },
  mapping_settings: [],
  dependent_field_settings: null as unknown as DependentFieldSetting,
  workspace_id: 366
} as ImportSettingGet;

export const configuration = {
  reimbursable_expenses_object: null,
  corporate_credit_card_expenses_object: 'CHARGE_CARD_TRANSACTION',
  import_code_fields: []
} as unknown as IntacctConfiguration;

export const locationEntityMapping: LocationEntityMapping = {
  id: 327,
  location_entity_name: 'Top Level',
  country_name: null,
  destination_id: 'top_level',
  created_at: new Date('2024-08-26T11:54:23.640893Z'),
  updated_at: new Date('2024-08-26T11:54:23.640913Z'),
  workspace: 366
};

export const groupedDestinationAttributes = {
  ACCOUNT: [],
  EXPENSE_TYPE: [],
  EXPENSE_PAYMENT_TYPE: [],
  VENDOR: [],
  EMPLOYEE: [],
  CHARGE_CARD_NUMBER: [],
  TAX_DETAIL: []
} as unknown as GroupedDestinationAttribute;


export const sageIntacctFieldsSortedByPriority = [
  {
    attribute_type: 'PROJECT',
    display_name: 'Project'
  },
  {
    attribute_type: 'CUSTOMER',
    display_name: 'Customer'
  },
  {
    attribute_type: 'ITEM',
    display_name: 'Item'
  }
] as ExpenseField[];

export const sageIntacctFieldsSortedByPriorityForC1 = [
  {
    attribute_type: 'PROJECT',
    display_name: 'Project'
  },
  {
    attribute_type: 'CUSTOMER',
    display_name: 'Customer'
  },
  {
    attribute_type: 'ITEM',
    display_name: 'Item'
  },
  {
    attribute_type: 'GENERAL_LEDGER_ACCOUNT',
    display_name: 'General ledger account',
    source_placeholder: '',
    is_dependent: false
  }
] as ExpenseField[];

export const importSettingsWithProjectMapping = {...importSettings, mapping_settings: [{
  source_field: 'PROJECT',
  destination_field: 'PROJECT',
  import_to_fyle: true
}]} as ImportSettingGet;

export const settingsWithDependentFields = {...importSettings, dependent_field_settings: {
  is_import_enabled: true,
  cost_code_field_name: 'COST_CODE',
  cost_code_placeholder: 'Enter Cost Code',
  cost_type_field_name: 'COST_TYPE',
  cost_type_placeholder: 'Enter Cost Type'
}} as ImportSettingGet;

export const costCodeFieldValue = {
  attribute_type: 'COST_CODE',
  display_name: 'COST_CODE',
  source_placeholder: 'Enter Cost Code',
  is_dependent: true
};

export const costTypeFieldValue = {
  attribute_type: 'COST_TYPE',
  display_name: 'COST_TYPE',
  source_placeholder: 'Enter Cost Type',
  is_dependent: true
};

export const customFieldValue = {
  source_field: '',
  destination_field: 'PROJECT',
  import_to_fyle: false,
  is_custom: false,
  source_placeholder: null
};

export const customField = {
  attribute_type: 'TEST_FIELD',
  source_placeholder: 'Test Placeholder',
  display_name: 'Test Field',
  is_dependent: false
};

export const expenseFieldsExpectedForC1 = [
  {
      source_field: "CATEGORY",
      destination_field: "GENERAL_LEDGER_ACCOUNT",
      import_to_fyle: false,
      is_custom: false,
      source_placeholder: null
  },
  {
      source_field: "PROJECT",
      destination_field: "PROJECT",
      import_to_fyle: true,
      is_custom: false,
      source_placeholder: null
  },
  {
      source_field: "",
      destination_field: "CUSTOMER",
      import_to_fyle: false,
      is_custom: false,
      source_placeholder: null
  },
  {
      source_field: "",
      destination_field: "ITEM",
      import_to_fyle: false,
      is_custom: false,
      source_placeholder: null
  }
];

export const blankMapping: MappingSetting = {
  source_field: '',
  destination_field: '',
  import_to_fyle: true,
  is_custom: false,
  source_placeholder: null
};

export const customFieldFormValue = {
  attribute_type: 'TEST',
  source_placeholder: 'TEST_PLACEHOLDER'
};

export const adminEmails =  [
  { name: 'John Doe', email: 'john.doe@example.com' },
  { name: 'Jane Smith', email: 'jane.smith@example.com' }
] as EmailOption[];

export const advancedSettings =  {
  workspace_schedules: {
    enabled: true,
    interval_hours: 12,
    emails_selected: ['john.doe@example.com'],
    additional_email_options: [
      { name: 'Additional User', email: 'additional.user@example.com' }
    ]
  },
  configurations: {
    sync_fyle_to_sage_intacct_payments: true,
    sync_sage_intacct_to_fyle_payments: false,
    auto_create_destination_entity: true,
    change_accounting_period: true,
    memo_structure: ['employee_email', 'merchant', 'purpose'],
    auto_create_merchants_as_vendors: false,
    je_single_credit_line: false
  },
  general_mappings: {
    default_location: { id: 'LOC1' },
    default_department: { id: 'DEP1' },
    default_project: { id: 'PRJ1' },
    default_class: { id: 'CLS1' },
    default_item: { id: 'ITEM1' },
    payment_account: { id: 'ACC1' },
    use_intacct_employee_locations: true,
    use_intacct_employee_departments: true
  }
} as unknown as AdvancedSettingsGet;

export const expenseFilter =  {
  count: 0
};

export const groupedAttributes =  {
  LOCATION: [{ destination_id: 'LOC1', value: 'Location 1' }] as IntacctDestinationAttribute[],
  DEPARTMENT: [{ destination_id: 'DEP1', value: 'Department 1' }] as IntacctDestinationAttribute[],
  PROJECT: [{ destination_id: 'PRJ1', value: 'Project 1' }] as IntacctDestinationAttribute[],
  CLASS: [{ destination_id: 'CLS1', value: 'Class 1' }] as IntacctDestinationAttribute[],
  ITEM: [{ destination_id: 'ITEM1', value: 'Item 1' }] as IntacctDestinationAttribute[],
  PAYMENT_ACCOUNT: [{ destination_id: 'ACC1', value: 'Account 1' }] as IntacctDestinationAttribute[]
} as GroupedDestinationAttribute;

export const configurationForAdvancedSettings =  {
  reimbursable_expenses_object: IntacctReimbursableExpensesObject.EXPENSE_REPORT,
  corporate_credit_card_expenses_object: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION,
  import_vendors_as_merchants: false,
  use_merchant_in_journal_line: true,
  employee_field_mapping: FyleField.EMPLOYEE
} as IntacctConfiguration;

export const configurationWithFyleToIntacct = {
  sync_fyle_to_sage_intacct_payments: true,
  sync_sage_intacct_to_fyle_payments: false
} as unknown as Configuration;

export const configurationWithIntacctToFyle = {
  sync_fyle_to_sage_intacct_payments: false,
  sync_sage_intacct_to_fyle_payments: true
} as unknown as Configuration;

export const configurationWithOutSync = {
  sync_fyle_to_sage_intacct_payments: false,
  sync_sage_intacct_to_fyle_payments: false
} as unknown as Configuration;

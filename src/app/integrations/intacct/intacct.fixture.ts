import { minimalUser } from "src/app/core/interceptor/jwt.fixture";
import { AccountingExportSummary } from "src/app/core/models/db/accounting-export-summary.model";
import { Error } from "src/app/core/models/db/error.model";
import { MinimalUser } from "src/app/core/models/db/user.model";
import { AccountingErrorType, CCCExpenseState, ExpenseState, ExportDateType, FyleField, IntacctCorporateCreditCardExpensesObject, IntacctOnboardingState, IntacctReimbursableExpensesObject, SplitExpenseGrouping, TaskLogState, TaskLogType } from "src/app/core/models/enum/enum.model";
import { IntacctWorkspace } from "src/app/core/models/intacct/db/workspaces.model";
import { ExportSettingGet } from "src/app/core/models/intacct/intacct-configuration/export-settings.model";


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
  failed_accounting_export_count: 0
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
  "is_simplify_report_closure_enabled": true,
  "change_accounting_period": true,
  "import_vendors_as_merchants": true,
  "use_merchant_in_journal_line": false,
  "auto_create_merchants_as_vendors": false,
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
  "workspace": 240
};


export const mockErrors = [
  { id: 1, type: AccountingErrorType.EMPLOYEE_MAPPING, error_title: 'Employee mapping error' },
  { id: 2, type: AccountingErrorType.CATEGORY_MAPPING, error_title: 'Category mapping error' },
  { id: 3, type: AccountingErrorType.ACCOUNTING_ERROR, error_title: 'Accounting error' }
] as Error[];

export const mockExportSettings = {
  configurations: {
    reimbursable_expenses_object: IntacctReimbursableExpensesObject.EXPENSE_REPORT,
    corporate_credit_card_expenses_object: IntacctCorporateCreditCardExpensesObject.BILL
  },
  expense_group_settings: {
    expense_state: ExpenseState.PAYMENT_PROCESSING,
    ccc_expense_state: ExpenseState.PAID
  }
} as unknown as ExportSettingGet;


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

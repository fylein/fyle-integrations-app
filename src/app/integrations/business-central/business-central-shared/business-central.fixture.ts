import { BusinessCentralAdvancedSettingsGet, BusinessCentralAdvancedSettingsModel } from "src/app/core/models/business-central/business-central-configuration/business-central-advanced-settings.model";
import { BusinessCentralExportSettingGet } from "src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model";
import { BusinessCentralImportSettingsGet } from "src/app/core/models/business-central/business-central-configuration/business-central-import-settings.model";
import { BusinessCentralDestinationAttributes } from "src/app/core/models/business-central/db/business-central-destination-attribute.model";
import { FyleField, IntegrationField } from "src/app/core/models/db/mapping.model";
import { ExpenseFilterResponse, ConditionField } from "src/app/core/models/common/advanced-settings.model";
import { BusinessCentralExportType, CCCExpenseState, ExpenseGroupedBy, ExpenseState, ExportDateType, JoinOption, Operator } from "src/app/core/models/enum/enum.model";

export const exportSettingsResponse: BusinessCentralExportSettingGet = {
  "id": 38,
  "created_at": new Date("2023-10-09T08:18:29.080160Z"),
  "reimbursable_expenses_export_type": BusinessCentralExportType.JOURNAL_ENTRY,
  "default_bank_account_name": "XYZ",
  "default_bank_account_id": "1232",
  "default_CCC_bank_account_name": "ABC",
  "default_CCC_bank_account_id": "2321",
  "reimbursable_expense_state": ExpenseState.PAYMENT_PROCESSING,
  "reimbursable_expense_date": ExportDateType.LAST_SPENT_AT,
  "reimbursable_expense_grouped_by": ExpenseGroupedBy.EXPENSE,
  "credit_card_expense_export_type": BusinessCentralExportType.JOURNAL_ENTRY,
  "credit_card_expense_state": CCCExpenseState.APPROVED,
  "credit_card_expense_grouped_by": ExpenseGroupedBy.EXPENSE,
  "credit_card_expense_date": ExportDateType.LAST_SPENT_AT,
  "updated_at": new Date("2023-10-09T08:18:29.080160Z"),
  "workspace": 1,
  "name_in_journal_entry": "",
  "employee_field_mapping": "",
  "auto_map_employees": "",
  "default_vendor_name": "",
  "default_vendor_id": ""
};

export const destinationAttributes: BusinessCentralDestinationAttributes[] = [
  {
    "id": 33929,
    "attribute_type": "COMPANY",
    "display_name": "Company",
    "value": "Columbus",
    "destination_id": "9f9cbd27-880e-441e-8cf",
    "auto_created": false,
    "active": true,
    "created_at": new Date("2023-10-09T08:18:29.080160Z"),
    "updated_at": new Date("2023-10-09T08:18:29.080160Z"),
    "workspace": 343,
    "detail": null
  }
];

export const importSettingsResponse: BusinessCentralImportSettingsGet = {
  "id": 123,
  "import_settings": {
    "import_categories": true,
    "import_vendors_as_merchants": true,
    "charts_of_accounts": ['Expense']
  },
  "mapping_settings": [],
  "workspace_id": 343,
  "created_at": new Date("2023-10-09T08:18:29.080160Z"),
  "updated_at": new Date("2023-10-09T08:18:29.080160Z")
};

export const fyleFieldsResponse: FyleField[] = [
  {
    "attribute_type": "CATEGORY",
    "display_name": "Category",
    "is_dependent": true
  },
  {
    "attribute_type": "Employee",
    "display_name": "Employee",
    "is_dependent": true
  }
];

export const businessCentralFieldsResponse: IntegrationField[] = [
  {
    "attribute_type": "LOCATION",
    "display_name": "Location"
  },
  {
    "attribute_type": "CATEGORY",
    "display_name": "Category"
  },
  {
    "attribute_type": "Employee",
    "display_name": "Employee"
  }
];

export const businessCentralAdvancedSettingResponse: BusinessCentralAdvancedSettingsGet = {
  "id": 37,
  "created_at": new Date("2023-10-09T11:26:49.324649Z"),
  "updated_at": new Date("2023-10-09T11:26:49.324649Z"),
  "top_memo_structure": [
    "employee_email"
  ],
  "expense_memo_structure": [
    "employee_email",
    "merchant",
    "purpose",
    "category",
    "spent_on",
    "report_number",
    "expense_link"
  ],
  "schedule_is_enabled": true,
  "workspace": 1,
  "interval_hours": 1
};

export const expenseFiltersGet: ExpenseFilterResponse =
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 45,
      "condition": "spent_at",
      "operator": Operator.LessThan,
      "values": [
          "2023-10-16T17:00:00.000Z"
      ],
      "rank": 1,
      "join_by": JoinOption.AND,
      "is_custom": false,
      "custom_field_type": null,
      "created_at": new Date(),
      "updated_at": new Date(),
      "workspace": 383
    },
    {
      "id": 46,
      "condition": "employee_email",
      "operator": Operator.IExact,
      "values": [
          "aba@gamil.com"
      ],
      "rank": 2,
      "join_by": null,
      "is_custom": false,
      "custom_field_type": null,
      "created_at": new Date(),
      "updated_at": new Date(),
      "workspace": 383
    }
  ]
};

export const expenseFilterCondition: ConditionField[] = [
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
    "field_name": "Class",
    "type": "SELECT",
    "is_custom": true
  },
  {
    "field_name": "Fyle Categories",
    "type": "SELECT",
    "is_custom": true
  },
  {
    "field_name": "Operating System",
    "type": "SELECT",
    "is_custom": true
  },
  {
    "field_name": "User Dimension",
    "type": "SELECT",
    "is_custom": true
  },
  {
    "field_name": "Asdasdas",
    "type": "SELECT",
    "is_custom": true
  },
  {
    "field_name": "Nilesh Custom Field",
    "type": "SELECT",
    "is_custom": true
  }
];

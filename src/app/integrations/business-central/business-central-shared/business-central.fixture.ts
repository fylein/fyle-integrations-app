import { BusinessCentralExportSettingGet } from "src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model";
import { BusinessCentralImportSettingsGet } from "src/app/core/models/business-central/business-central-configuration/business-central-import-settings.model";
import { BusinessCentralDestinationAttributes } from "src/app/core/models/business-central/db/business-central-destination-attribute.model";
import { FyleField, IntegrationField } from "src/app/core/models/db/mapping.model";
import { BusinessCentralExportType, CCCExpenseState, ExpenseGroupedBy, ExpenseState, ExportDateType } from "src/app/core/models/enum/enum.model";

export const exportSettingsResponse: BusinessCentralExportSettingGet = {
  "id": 38,
  "created_at": new Date("2023-10-09T08:18:29.080160Z"),
  "reimbursable_expenses_export_type": BusinessCentralExportType.JOURNAL_ENTRY,
  "default_bank_account_name": "XYZ",
  "default_bank_account_id": "1232",
  "reimbursable_expense_state": ExpenseState.PAYMENT_PROCESSING,
  "reimbursable_expense_date": ExportDateType.LAST_SPENT_AT,
  "reimbursable_expense_grouped_by": ExpenseGroupedBy.EXPENSE,
  "credit_card_expense_export_type": BusinessCentralExportType.JOURNAL_ENTRY,
  "credit_card_expense_state": CCCExpenseState.PAYMENT_PROCESSING,
  "default_credit_card_account_name": "ASSS",
  "default_credit_card_account_id": "212",
  "credit_card_expense_grouped_by": ExpenseGroupedBy.EXPENSE,
  "credit_card_expense_date": ExportDateType.LAST_SPENT_AT,
  "updated_at": new Date("2023-10-09T08:18:29.080160Z"),
  "workspace": 1,
  "credit_card_entity_name_preference": "EMPLOYEE",
  "employee_mapping": "EMAIL"
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
    "import_categories": true,
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
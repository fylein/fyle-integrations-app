import { QBDCorporateCreditCardExpensesObject, QBDEntity, QBDExpenseGroupedBy, ExpenseState, CCCExpenseState, QBDExportDateType, QBDReimbursableExpensesObject } from "src/app/core/models/enum/enum.model";
import { QBDExportSettingGet } from "src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model";

export const QBDExportSettingResponse:QBDExportSettingGet = {
    id: 1,
    created_at: new Date('2023-02-01T08:42:45.803382Z'),
    updated_at: new Date('2023-02-01T08:42:45.803382Z'),
    reimbursable_expenses_export_type: QBDReimbursableExpensesObject.BILL,
    bank_account_name: "string",
    mileage_account_name: "string",
    reimbursable_expense_state: ExpenseState.PAYMENT_PROCESSING,
    reimbursable_expense_date: QBDExportDateType.SPENT_AT,
    reimbursable_expense_grouped_by: QBDExpenseGroupedBy.REPORT,
    credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY,
    credit_card_expense_state: CCCExpenseState.PAID,
    credit_card_entity_name_preference: QBDEntity.VENDOR,
    credit_card_account_name: "string",
    credit_card_expense_grouped_by: QBDExpenseGroupedBy.EXPENSE,
    credit_card_expense_date: QBDExportDateType.LAST_SPENT_AT,
    workspace: 1,
    is_simplify_report_closure_enabled: true
};

export const QBDExportSettingResponse2:QBDExportSettingGet = {
  id: 1,
  created_at: new Date('2023-02-01T08:42:45.803382Z'),
  updated_at: new Date('2023-02-01T08:42:45.803382Z'),
  reimbursable_expenses_export_type: null,
  bank_account_name: null,
  mileage_account_name: null,
  reimbursable_expense_state: null,
  reimbursable_expense_date: null,
  reimbursable_expense_grouped_by: null,
  credit_card_expense_export_type: null,
  credit_card_expense_state: null,
  credit_card_entity_name_preference: null,
  credit_card_account_name: null,
  credit_card_expense_grouped_by: null,
  credit_card_expense_date: null,
  workspace: 1,
  is_simplify_report_closure_enabled: false
};

export const errorResponse = {
    status: 404,
    statusText: "Not Found",
    error: {
      id: 1,
      is_expired: true,
      company_name: 'QBO'
    }
  };
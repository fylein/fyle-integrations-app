import {
  AutoMapEmployeeOptions,
  IntacctCorporateCreditCardExpensesObject,
  FyleField,
  IntacctReimbursableExpensesObject,
} from '../../enum/enum.model';

export type Configuration = {
  id: number;
  workspace: number;
  employee_field_mapping: FyleField;
  reimbursable_expenses_object: IntacctReimbursableExpensesObject | null;
  corporate_credit_card_expenses_object: IntacctCorporateCreditCardExpensesObject | null;
  import_projects: boolean;
  import_categories: boolean;
  sync_fyle_to_sage_intacct_payments: boolean;
  sync_sage_intacct_to_fyle_payments: boolean;
  auto_map_employees: AutoMapEmployeeOptions | null;
  import_tax_codes: boolean;
  memo_structure: string[];
  top_level_memo_structure: string[];
  auto_create_destination_entity: boolean;
  change_accounting_period: boolean;
  import_vendors_as_merchants: boolean;
  je_single_credit_line: boolean;
  created_at: Date;
  updated_at: Date;
};

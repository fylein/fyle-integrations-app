import { AutoMapEmployeeOptions, EmployeeFieldMapping, NameInJournalEntry, NetSuiteCorporateCreditCardExpensesObject, NetsuiteReimbursableExpensesObject } from "../../enum/enum.model";

export type NetsuiteConfiguration = {
  id: number;
  import_projects: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  employee_field_mapping: EmployeeFieldMapping;
  auto_map_employees: AutoMapEmployeeOptions | null;
  reimbursable_expenses_object: NetsuiteReimbursableExpensesObject | null;
  corporate_credit_card_expenses_object: NetSuiteCorporateCreditCardExpensesObject | null;
  import_categories: boolean;
  import_items: boolean;
  import_vendors_as_merchants: boolean;
  charts_of_accounts: string[];
  import_tax_items: boolean;
  sync_fyle_to_netsuite_payments: boolean;
  sync_netsuite_to_fyle_payments: boolean;
  auto_create_destination_entity: boolean;
  auto_create_merchants_as_vendors: boolean,
  je_single_credit_line: boolean;
  change_accounting_period: boolean;
  memo_structure: string[];
  category_sync_version: string;
  map_merchant_to_vendor: boolean;
  import_netsuite_employees: boolean;
  skip_cards_mapping: boolean;
  map_fyle_cards_netsuite_account: boolean;
  name_in_journal_entry: NameInJournalEntry;
  allow_intercompany_vendors: boolean;
};

import { AutoMapEmployeeOptions, IntacctCorporateCreditCardExpensesObject, FyleField, IntacctReimbursableExpensesObject } from "../enum/enum.model";

export interface IntacctConfiguration {
    id: number;
    workspace: number;
    employee_field_mapping: FyleField;
    reimbursable_expenses_object?: IntacctReimbursableExpensesObject;
    corporate_credit_card_expenses_object?: IntacctCorporateCreditCardExpensesObject;
    import_projects: boolean;
    import_categories: boolean;
    sync_fyle_to_sage_intacct_payments: boolean;
    sync_sage_intacct_to_fyle_payments: boolean;
    auto_map_employees: AutoMapEmployeeOptions | null;
    import_tax_codes?: boolean;
    memo_structure: string[];
    auto_create_destination_entity: boolean;
    je_single_credit_line: boolean;
    change_accounting_period: boolean;
    import_vendors_as_merchants: boolean;
    created_at: Date;
    updated_at: Date;
    use_merchant_in_journal_line: boolean;
  }

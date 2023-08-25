export interface Configuration {
    id: number; // Unique Id to identify a workspace
    workspace: number; // Reference to Workspace model
    employee_field_mapping?: string; // Employee field mapping
    reimbursable_expenses_object?: string; // Mapping Settings (BILL / EXPENSE_REPORT)
    corporate_credit_card_expenses_object?: string; // Mapping Settings (BILL / CHARGE_CARD_TRANSACTION)
    import_projects: boolean; // Auto import projects to Fyle
    import_categories: boolean; // Auto import categories to Fyle
    sync_fyle_to_sage_intacct_payments: boolean; // Auto Sync Payments from Fyle to Sage Intacct
    sync_sage_intacct_to_fyle_payments: boolean; // Auto Sync Payments from Sage Intacct to Fyle
    auto_map_employees?: string; // Auto Map Employees type from Sage Intacct to Fyle
    import_tax_codes?: boolean; // Auto import tax codes to Fyle
    memo_structure: string[]; // List of system fields for creating custom memo
    auto_create_destination_entity: boolean; // Auto create vendor / employee
    is_simplify_report_closure_enabled: boolean; // Simplify report closure is enabled
    change_accounting_period: boolean; // Change the accounting period
    import_vendors_as_merchants: boolean; // Auto import vendors from sage intacct as merchants to Fyle
    created_at: Date; // Created at
    updated_at: Date; // Updated at
  }

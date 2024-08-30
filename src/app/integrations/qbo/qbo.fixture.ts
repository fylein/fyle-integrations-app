import { MinimalUser } from "src/app/core/models/db/user.model";
import { QBOOnboardingState } from "src/app/core/models/enum/enum.model";

export const mockUser: MinimalUser = {
    org_id: '123',
    email: 'test@example.com',
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    full_name: 'Test User',
    user_id: 'user123',
    org_name: 'Test Org'
};

export const mockWorkspace = {
    id: '1',
    onboarding_state: QBOOnboardingState.CONNECTION
};

export const mockWorkspaces = [mockWorkspace];

const qboExportSettingsfixture = {
    "workspace_general_settings": {
        "reimbursable_expenses_object": "BILL",
        "corporate_credit_card_expenses_object": "BILL",
        "is_simplify_report_closure_enabled": true,
        "name_in_journal_entry": "EMPLOYEE"
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

export default qboExportSettingsfixture;
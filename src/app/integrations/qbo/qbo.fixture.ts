import { MinimalUser } from "src/app/core/models/db/user.model";
import { CCCExpenseState, ExpenseState, ExportDateType, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOOnboardingState, QBOReimbursableExpensesObject, SplitExpenseGrouping } from "src/app/core/models/enum/enum.model";

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

export const mockExportSettings = {
    "workspace_general_settings": {
        "reimbursable_expenses_object": QBOReimbursableExpensesObject.BILL,
        "corporate_credit_card_expenses_object": QBOCorporateCreditCardExpensesObject.BILL,
        "is_simplify_report_closure_enabled": true,
        "name_in_journal_entry": NameInJournalEntry.EMPLOYEE
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
        "expense_state": ExpenseState.PAYMENT_PROCESSING,
        "ccc_expense_state": CCCExpenseState.APPROVED,
        "reimbursable_export_date_type": ExportDateType.SPENT_AT,
        "ccc_export_date_type": ExportDateType.VERIFIED_AT,
        "split_expense_grouping": SplitExpenseGrouping.MULTIPLE_LINE_ITEM
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

export const qboPaginatedDestinationAttribute = {
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 253175,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Ashwin Bankkkk",
            "destination_id": "167",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Ashwin Bankkkk"
            },
            "code": 'anish',
            "created_at": new Date("2024-08-22T06:44:11.074373Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074401Z"),
            "workspace": 512
        },
        {
            "id": 253176,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Checking",
            "destination_id": "35",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Checking"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074447Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074458Z"),
            "workspace": 512
        },
        {
            "id": 253177,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Checking Debit Card",
            "destination_id": "131",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Checking Debit Card"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074498Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074508Z"),
            "workspace": 512
        },
        {
            "id": 253178,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Gayathiri",
            "destination_id": "128",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Gayathiri"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074544Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074554Z"),
            "workspace": 512
        },
        {
            "id": 253179,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Savings",
            "destination_id": "36",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Savings"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074591Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074601Z"),
            "workspace": 512
        }
    ]
}

export const mockPaginatedDestinationAttributes = {
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 253175,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Ashwin Bankkkk",
            "destination_id": "167",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Ashwin Bankkkk"
            },
            "code": 'anish',
            "created_at": new Date("2024-08-22T06:44:11.074373Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074401Z"),
            "workspace": 512
        },
        {
            "id": 253176,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Checking",
            "destination_id": "35",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Checking"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074447Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074458Z"),
            "workspace": 512
        },
        {
            "id": 253177,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Checking Debit Card",
            "destination_id": "131",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Checking Debit Card"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074498Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074508Z"),
            "workspace": 512
        },
        {
            "id": 253178,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Gayathiri",
            "destination_id": "128",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Gayathiri"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074544Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074554Z"),
            "workspace": 512
        },
        {
            "id": 253179,
            "attribute_type": "BANK_ACCOUNT",
            "display_name": "Bank Account",
            "value": "Savings",
            "destination_id": "36",
            "auto_created": false,
            "active": true,
            "detail": {
                "account_type": "Bank",
                "fully_qualified_name": "Savings"
            },
            "code": "anish",
            "created_at": new Date("2024-08-22T06:44:11.074591Z"),
            "updated_at": new Date("2024-08-22T06:44:11.074601Z"),
            "workspace": 512
        }
    ]
};


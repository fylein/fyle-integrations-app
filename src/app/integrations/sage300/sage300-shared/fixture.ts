import type { ConditionField, EmailOption, ExpenseFilterResponse } from "src/app/core/models/common/advanced-settings.model";
import type { FyleField, IntegrationField } from "src/app/core/models/db/mapping.model";
import { JoinOption, Operator } from "src/app/core/models/enum/enum.model";
import type { Sage300DestinationAttributes } from "src/app/core/models/sage300/db/sage300-destination-attribuite.model";
import type { Sage300AdvancedSettingGet } from "src/app/core/models/sage300/sage300-configuration/sage300-advanced-settings.model";
import type { Sage300ImportSettingGet } from "src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model";

export const importSettingsResponse: Sage300ImportSettingGet = {
    "import_settings": {
        "import_categories": false,
        "import_vendors_as_merchants": false,
        "add_commitment_details": false,
        "import_code_fields": []
    },
    "mapping_settings": [
        {
            "source_field": "COST_CENTER",
            "destination_field": "CLASS",
            "import_to_fyle": false,
            "is_custom": false,
            "source_placeholder": null
        },
        {
            "source_field": "PROJECT",
            "destination_field": "PROJECT",
            "import_to_fyle": true,
            "is_custom": false,
            "source_placeholder": null
        }
    ],
    "dependent_field_settings": {
        "cost_code_field_name": "Sage Cost COde",
        "cost_code_placeholder": "null",
        "cost_category_field_name": "Sage Cost Type",
        "cost_category_placeholder": "null",
        "is_import_enabled": true
    },
    workspaceId: 312
};

export const fyleFieldsResponse: FyleField[] = [
    {
        "attribute_type": "COST_CENTER",
        "display_name": "Cost Center",
        "is_dependent": false
    },
    {
        "attribute_type": "PROJECT",
        "display_name": "Project",
        "is_dependent": false
    },
    {
        "attribute_type": "CLASS",
        "display_name": "Class",
        "is_dependent": false
    }
];
export const sage300FieldsResponse: IntegrationField[] =
[
    {
        "attribute_type": "COST_CENTER",
        "display_name": "Cost Center"
    },
    {
        "attribute_type": "PROJECT",
        "display_name": "Project"
    },
    {
        "attribute_type": "CLASS",
        "display_name": "Class"
    }
];

export const sage300AdvancedSettingResponse: Sage300AdvancedSettingGet = {
    memo_structure: [
        "employee_email",
        "category",
        "spent_on",
        "report_number",
        "purpose",
        "expense_link"
    ],
    schedule_is_enabled: true,
    id: 0,
    created_at: new Date(),
    update_at: new Date(),
    workspace: 1,
    auto_create_vendor: false,
    interval_hours: 1
};

export const adminEmails: EmailOption[] = [
	{
		"name": "Nilesh Pant",
		"email": "nilesh.p@fyle.in"
    }
];

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

export const destinationAttributes: Sage300DestinationAttributes[] = [
    {
        "id": 214726,
        "attribute_type": "CHARGE_CARD_NUMBER",
        "display_name": "Charge Card Account",
        "value": "1234",
        "destination_id": "1234",
        "auto_created": false,
        "active": false,
        "detail": null,
        "created_at": new Date(),
        "updated_at": new Date(),
        "workspace": 313
    },
    {
        "id": 214731,
        "attribute_type": "VENDOR",
        "display_name": "vendor",
        "value": "A-1 Electric Company",
        "destination_id": "V100",
        "auto_created": false,
        "active": true,
        "detail": {
            "email": null
        },
        "created_at": new Date(),
        "updated_at": new Date(),
        "workspace": 313
    }
];
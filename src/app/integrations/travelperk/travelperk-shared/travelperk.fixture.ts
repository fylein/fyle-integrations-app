import { FyleField, TravelPerkExpenseGroup, TravelPerkUserRole } from "src/app/core/models/enum/enum.model";
import { TravelperkAdvancedSettingGet } from "src/app/core/models/travelperk/travelperk-configuration/travelperk-advanced-settings.model";
import { TravelperkPaymentProfileSettingResponse } from "src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model";
import { TravelperkDestinationAttribuite } from "src/app/core/models/travelperk/travelperk.model";

export const travelperkPaymentProfileMappingResponse: TravelperkPaymentProfileSettingResponse = {
    next: '',
    previous: '',
    count: 1,
    results: [
        {
            "profile_name": "Payment Profile",
            "user_role": TravelPerkUserRole.BOOKER,
            "is_import_enabled": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "profile_name": "Payment Profile",
            "user_role": TravelPerkUserRole.BOOKER,
            "is_import_enabled": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "profile_name": "Payment Profile",
            "user_role": TravelPerkUserRole.BOOKER,
            "is_import_enabled": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "profile_name": "Payment Profile",
            "user_role": TravelPerkUserRole.BOOKER,
            "is_import_enabled": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "profile_name": "Payment Profile",
            "user_role": TravelPerkUserRole.BOOKER,
            "is_import_enabled": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "profile_name": "Payment Profile",
            "user_role": TravelPerkUserRole.BOOKER,
            "is_import_enabled": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        }
    ]
};

export const travelperkAdvancedSettingsResponse: TravelperkAdvancedSettingGet = {
    "default_employee": "nilesh.p@fyle.in",
    "default_employee_id": "212",
    "default_category": "travel",
    "default_category_id": "12312",
    "description_structure": [
        "trip_id"
    ],
    "invoice_lineitem_structure": TravelPerkExpenseGroup.MULTIPLE,
    "created_at": new Date("12/11/1999"),
    "updated_at": new Date("12/11/1999"),
    "org": 1,
    "id": 1,
    category_mappings: {
        "Cars": {"name": "xyz", "id": '123'},
        "Stays": {"name": "xyz", "id": '278'}
    }
};

export const travelperkDestinationAttribute: TravelperkDestinationAttribuite[] = [
    {
        "id": 1,
        "attribute_type": FyleField.CATEGORY,
        "value": "Truck:Original Cost",
        "active": true,
        "detail": null,
        "created_at": new Date("12/11/1999"),
        "updated_at": new Date("12/11/1999"),
        "source_id": "123",
        "auto_created": false,
        "org": 2
    },
    {
        "id": 1,
        "attribute_type": FyleField.CATEGORY,
        "value": "Truck Cost",
        "active": true,
        "detail": null,
        "created_at": new Date("12/11/1999"),
        "updated_at": new Date("12/11/1999"),
        "source_id": "278",
        "auto_created": false,
        "org": 2
    }
];

import { FyleField, TravelPerkExpenseGroup, TravelPerkUserRole } from "src/app/core/models/enum/enum.model";
import { TravelperkAdvancedSettingGet } from "src/app/core/models/travelperk/travelperk-configuration/travelperk-advanced-settings.model";
import { TravelperkPaymentProfileSettingGetPaginator } from "src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model";
import { TravelperkDestinationAttribuite } from "src/app/core/models/travelperk/travelperk.model";

export const travelperkPaymentProfileMappingResponse: TravelperkPaymentProfileSettingGetPaginator = {
    next: '',
    previous: '',
    count: 1,
    results: [
        {
            "payment_profile_name": "Payment Profile",
            "payment_profile_id": '123',
            "user_role": TravelPerkUserRole.BOOKER,
            "import_to_fyle": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "payment_profile_name": "Payment Profile",
            "payment_profile_id": '123',
            "user_role": TravelPerkUserRole.BOOKER,
            "import_to_fyle": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "payment_profile_name": "Payment Profile",
            "payment_profile_id": '123',
            "user_role": TravelPerkUserRole.BOOKER,
            "import_to_fyle": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "payment_profile_name": "Payment Profile",
            "payment_profile_id": '123',
            "user_role": TravelPerkUserRole.BOOKER,
            "import_to_fyle": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "payment_profile_name": "Payment Profile",
            "payment_profile_id": '123',
            "user_role": TravelPerkUserRole.BOOKER,
            "import_to_fyle": true,
            "created_at": new Date("12/11/1999"),
            "updated_at": new Date("12/11/1999"),
            "org": 2,
            "id": 1
        },
        {
            "payment_profile_name": "Payment Profile",
            "payment_profile_id": '123',
            "user_role": TravelPerkUserRole.BOOKER,
            "import_to_fyle": true,
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
    "id": 1
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
        "source_id": "278508",
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
        "source_id": "278508",
        "auto_created": false,
        "org": 2
    }
];

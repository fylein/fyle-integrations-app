import { TravelPerkUserRole } from "src/app/core/models/enum/enum.model";
import { TravelperkPaymentProfileSettingGetPaginator } from "src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model";

export const travelperkPaymentProfileMappingResponse: TravelperkPaymentProfileSettingGetPaginator = {
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
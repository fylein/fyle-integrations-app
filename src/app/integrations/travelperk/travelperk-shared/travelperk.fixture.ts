import { TravelPerkUserRole } from "src/app/core/models/enum/enum.model";
import { TravelperkPaymentProfileSettingGetPaginator } from "src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model";

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
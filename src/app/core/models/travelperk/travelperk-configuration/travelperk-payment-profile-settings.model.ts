import { expand } from "rxjs";
import { TravelPerkUserRole } from "../../enum/enum.model";
import { Paginator } from "../../misc/paginator.model";

export type TravelperkPaymentProfileSetting = {
    payment_profile_name: string,
	payment_profile_id: string,
	user_role: TravelPerkUserRole,
	import_to_fyle: boolean
}

export interface TravelperkPaymentProfileSettingGet extends TravelperkPaymentProfileSetting {
    id: number,
    created_at: Date,
    update_at: Date,
    workspace: number
}

export interface TravelperkPaymentProfileSettingPost extends TravelperkPaymentProfileSetting { }

export interface TravelperkPaymentProfileSettingGetPaginator extends Paginator {
    results: TravelperkPaymentProfileSettingGet[]
}
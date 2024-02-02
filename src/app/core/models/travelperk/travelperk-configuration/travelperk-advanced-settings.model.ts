import { TravelPerkExpenseGroup } from "../../enum/enum.model";

export type TravelperkAdvancedSetting = {
    default_employee: string,
	default_employee_id: string,
	default_category: string,
	default_category_id: string,
	description_structure: string[],
	invoice_lineitem_structure: TravelPerkExpenseGroup,
}

export interface TravelperkAdvancedSettingGet extends TravelperkAdvancedSetting {
    id: number,
    created_at: Date,
    update_at: Date,
    org: number
}

export interface TravelperkAdvancedSettingPost extends TravelperkAdvancedSetting { }

import { Org} from 'src/app/core/models/org/org.model';
import { TravelPerkExpenseGroup, TravelPerkUserRole } from '../enum/enum.model';

export type Travelperk = {
    id: number;
    folder_id: string;
    package_id: string;
    is_fyle_connected: boolean;
    is_travelperk_connected: boolean;
    is_s3_connected: boolean;
    org: number;
    travelperk_connection_id: number;
    created_at: Date;
    updated_at: Date;
}

export type TravelperkConfiguration = {
    id: number,
    org: Org,
    recipe_id: string,
    recipe_data: string
    is_recipe_enabled: boolean
}


export type WorkatoConnectionStatus = {
    wk: boolean,
    type: string,
    payload: {
        id: number,
        provider: string
        connected?: boolean,
        error?: string,
    }
}

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
    workspace: number
}

export interface TravelperkAdvancedSettingPost extends TravelperkAdvancedSetting { }

export type TravelperkProfileMapping = {
    payment_profile_name: string,
	payment_profile_id: string,
	user_role: TravelPerkUserRole,
	import_to_fyle: boolean
}

export interface TravelperkProfileMappingGet extends TravelperkProfileMapping {
    id: number,
    created_at: Date,
    update_at: Date,
    workspace: number
}

export interface TravelperkProfileMappingPost extends TravelperkProfileMapping { }

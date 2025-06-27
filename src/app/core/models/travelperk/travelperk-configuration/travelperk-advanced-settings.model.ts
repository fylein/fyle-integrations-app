import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { TravelPerkExpenseGroup } from "../../enum/enum.model";
import { SelectFormLabel, SelectFormOption } from "../../common/select-form-option.model";
import { TravelperkDestinationAttribuite } from "../travelperk.model";

export interface TravelperkCategoryMapping {
    [key: string]:  {
        id: string;
        name: string;
    };
}

export type TravelperkAdvancedSetting = {
    default_employee_name: string,
	default_employee_id: string,
	default_category_name: string,
	default_category_id: string,
	description_structure: string[],
	invoice_lineitem_structure: TravelPerkExpenseGroup,
    category_mappings: TravelperkCategoryMapping
}

export interface TravelperkAdvancedSettingGet extends TravelperkAdvancedSetting {
    id: number,
    created_at: Date,
    updated_at: Date,
    org: number
}

export type TravelperkAdvancedSettingArray = {
    destination_name: SelectFormLabel;
    source_name: TravelperkDestinationAttribuite | null;
}

export type TravelperkAdvancedSettingFormArray = {
    destinationName: SelectFormLabel;
    sourceName: TravelperkDestinationAttribuite | null;
}

export interface TravelperkAdvancedSettingPost extends TravelperkAdvancedSetting { }


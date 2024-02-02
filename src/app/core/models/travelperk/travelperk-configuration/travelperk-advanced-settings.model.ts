import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TravelPerkExpenseGroup } from "../../enum/enum.model";
import { TravelperkFormOption } from "../travelperk.model";

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
    updated_at: Date,
    org: number
}

export interface TravelperkAdvancedSettingPost extends TravelperkAdvancedSetting { }

export class TravelperkAdvancedSettingModel {
    static getExpenseGroup(): TravelperkFormOption[] {
        return [
            {
                label: 'Single Expense',
                value: TravelPerkExpenseGroup.SINGLE
            },
            {
                label: 'Multiple Expenses',
                value: TravelPerkExpenseGroup.MULTIPLE
            }
        ];
    }

    static mapAPIResponseToFormGroup(advancedSettings: TravelperkAdvancedSettingGet | null): FormGroup {
        const defaultMemoOptions: string[] = ['Trip ID', 'Trip Name', 'Traveler Name', 'Booker Name', 'Merchant Name'];
        return new FormGroup({
            descriptionStructure: new FormControl(advancedSettings?.description_structure ? advancedSettings?.description_structure : defaultMemoOptions),
            defaultEmployee: new FormControl(advancedSettings?.default_employee ? advancedSettings?.default_employee : null),
            defaultEmployeeId: new FormControl(advancedSettings?.default_employee_id ? advancedSettings?.default_employee_id : null),
            defaultCategory: new FormControl(advancedSettings?.default_category ? advancedSettings?.default_category : null),
            invoiceLineitemStructure: new FormControl(advancedSettings?.invoice_lineitem_structure ? advancedSettings.invoice_lineitem_structure : null, Validators.required)
        });
    }

    static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): TravelperkAdvancedSettingPost {
        return {
            default_employee: advancedSettingsForm.get('defaultEmployee')?.value ? advancedSettingsForm.get('defaultEmployee')?.value : null,
            default_employee_id: advancedSettingsForm.get('defaultEmployeeId')?.value ? advancedSettingsForm.get('defaultEmployeeId')?.value : null,
            default_category: advancedSettingsForm.get('defaultCategory')?.value ? advancedSettingsForm.get('defaultCategory')?.value.value : null,
            default_category_id: advancedSettingsForm.get('defaultCategory')?.value ? advancedSettingsForm.get('defaultCategory')?.value.destination_id : null,
            description_structure: advancedSettingsForm.get('descriptionStructure')?.value ? advancedSettingsForm.get('descriptionStructure')?.value : null,
            invoice_lineitem_structure: advancedSettingsForm.get('invoiceLineitemStructure')?.value ? advancedSettingsForm.get('invoiceLineitemStructure')?.value : null
        };
    }
}

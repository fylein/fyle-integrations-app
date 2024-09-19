import type { SelectFormOption } from "../../common/select-form-option.model";
import { TravelPerkUserRole } from "../../enum/enum.model";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import type { PaginatedResponse } from "../../db/paginated-response.model";

export interface TravelperkPaymentProfileSetting {
    profile_name: string,
	user_role: TravelPerkUserRole | null,
	is_import_enabled: boolean
}

export interface TravelperkPaymentProfileSettingGet extends TravelperkPaymentProfileSetting {
    id: number,
    created_at: Date,
    updated_at: Date,
    org: number
}

export interface TravelperkPaymentProfileSettingPost extends TravelperkPaymentProfileSetting { }

export interface TravelperkPaymentProfileSettingResponse extends PaginatedResponse {
    results: TravelperkPaymentProfileSettingGet[]
}

export class TravelperkPaymentProfileSettingModel {

    static getUserRoleOptions(): SelectFormOption[] {
        return [
            {
                label: 'Booker',
                value: TravelPerkUserRole.BOOKER
            },
            {
                label: 'Card Holder',
                value: TravelPerkUserRole.CARD_HOLDER
            },
            {
                label: 'Traveller',
                value: TravelPerkUserRole.TRAVELLER
            }
        ];
    }

    static createFormGroup(data: TravelperkPaymentProfileSettingGet): FormGroup {
        return new FormGroup ({
            destinationName: new FormControl(data.profile_name || ''),
            sourceName: new FormControl(data.user_role || null),
            isImportEnabled: new FormControl(data.is_import_enabled || false)
        });
    }

    static constructFormArray(arrayData: TravelperkPaymentProfileSettingGet[]): FormGroup[] {
        const resultentArray:FormGroup[] = [];
        arrayData.forEach((data) => resultentArray.push(this.createFormGroup(data)));
        return resultentArray;
    }

    static constructPaymentProfileMapping(paymentProfileFieldArray: any): TravelperkPaymentProfileSettingPost[] {
        const paymentProfileSettings = paymentProfileFieldArray.map((field: any) => {
            return {
                profile_name: field.destinationName,
                is_import_enabled: field.isImportEnabled,
                user_role: field.sourceName
            };
        });

        return paymentProfileSettings;
      }

    static mapAPIResponseToFormGroup(travelperkPaymentProfileSettingResponse:TravelperkPaymentProfileSettingGet[] | null): FormGroup {
        const paymentProfileMappingsArray = travelperkPaymentProfileSettingResponse ? this.constructFormArray(travelperkPaymentProfileSettingResponse) : [] ;
        return new FormGroup({
            paymentProfileMappings: new FormArray(paymentProfileMappingsArray)
        });
    }

    static createPaymentProfileSettingPayload(travelperkPaymentProfileSettingForm: FormGroup){
        return this.constructPaymentProfileMapping(travelperkPaymentProfileSettingForm.value.paymentProfileMappings);
    }

}

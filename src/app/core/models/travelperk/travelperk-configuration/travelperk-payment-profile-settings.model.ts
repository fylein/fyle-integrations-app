import { SelectFormOption } from "../../common/select-form-option.model";
import { TravelPerkUserRole } from "../../enum/enum.model";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { PaginatedResponse } from "../../db/paginated-response.model";

export type TravelperkPaymentProfileSetting = {
    payment_profile_name: string,
	payment_profile_id: string,
	user_role: TravelPerkUserRole | null,
	import_to_fyle: boolean
}

export interface TravelperkPaymentProfileSettingGet extends TravelperkPaymentProfileSetting {
    id: number,
    created_at: Date,
    updated_at: Date,
    org: number
}

export interface TravelperkPaymentProfileSettingPost extends TravelperkPaymentProfileSetting { }

export interface TravelperkPaymentProfileSettingGetPaginator extends PaginatedResponse {
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
            paymentProfileName: new FormControl(data.payment_profile_name || ''),
            paymentProfileId: new FormControl(data.payment_profile_id || ''),
            userRole: new FormControl(data.user_role || null),
            importToFyle: new FormControl(data.import_to_fyle || false)
        });
    }

    static constructFormArray(arrayData: TravelperkPaymentProfileSettingGet[]): FormGroup[] {
        const resultentArray:FormGroup[] = [];
        arrayData.forEach((data) => resultentArray.push(this.createFormGroup(data)));
        return resultentArray;
    }

    static constructPaymentProfileMapping(paymentProfileFieldArray: TravelperkPaymentProfileSettingGet[]): TravelperkPaymentProfileSettingPost[] {
        const filteredExpenseFieldArray = paymentProfileFieldArray.filter((field: TravelperkPaymentProfileSetting) => field.user_role);

        const paymentProfileSettings = filteredExpenseFieldArray.map((field: TravelperkPaymentProfileSetting) => {
          return {
            payment_profile_name: field.payment_profile_name,
            payment_profile_id: field.payment_profile_id,
            import_to_fyle: field.import_to_fyle,
            user_role: field.user_role
          };
        });

        return paymentProfileSettings;
      }

    static mapAPIResponseToFormGroup(travelperkPaymentProfileSettingResponse:TravelperkPaymentProfileSettingGet[] | null): FormGroup {
        const expenseFieldsArray = travelperkPaymentProfileSettingResponse ? this.constructFormArray(travelperkPaymentProfileSettingResponse) : [] ;
        return new FormGroup({
            userRoleFields: new FormArray(expenseFieldsArray)
        });
    }

    static createPaymentProfileSettingPayload(travelperkPaymentProfileSettingForm: FormGroup){
        return this.constructPaymentProfileMapping(travelperkPaymentProfileSettingForm.value.expenseFields);
    }

}
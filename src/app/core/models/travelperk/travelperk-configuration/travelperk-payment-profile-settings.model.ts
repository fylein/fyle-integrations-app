import { expand } from "rxjs";
import { TravelPerkUserRole } from "../../enum/enum.model";
import { Paginator } from "../../misc/paginator.model";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type TravelperkPaymentProfileSetting = {
    payment_profile_name: string,
	payment_profile_id: string,
	user_role: TravelPerkUserRole | null,
	import_to_fyle: boolean
}

export interface TravelperkPaymentProfileSettingGet extends TravelperkPaymentProfileSetting {
    id: number,
    created_at: Date,
    update_at: Date,
    org: number
}

export interface TravelperkPaymentProfileSettingPost extends TravelperkPaymentProfileSetting { }

export interface TravelperkPaymentProfileSettingGetPaginator extends Paginator {
    results: TravelperkPaymentProfileSettingGet[]
}

export type TravelPerkPaymetProfileSettingFormOption = {
    label: string,
    value: TravelPerkUserRole
}

export class TravelperkPaymentProfileSettingModel {

    static getUserRoles(): TravelPerkPaymetProfileSettingFormOption[] {
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
            payment_profile_name: new FormControl(data.payment_profile_name || ''),
            payment_profile_id: new FormControl(data.payment_profile_id || ''),
            user_role: new FormControl(data.user_role || null),
            import_to_fyle: new FormControl(data.import_to_fyle || false)
        });
    }

    static constructFormArray(arrayData: TravelperkPaymentProfileSettingGet[]): FormGroup[] {
        const arr:FormGroup[] = [];
        arrayData.forEach((data) => arr.push(this.createFormGroup(data)));
        return arr;
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
            expenseFields: new FormArray(expenseFieldsArray)
        });
    }

    static createPaymentProfileSettingPayload(travelperkPaymentProfileSettingForm: FormGroup){
        return this.constructPaymentProfileMapping(travelperkPaymentProfileSettingForm.value.expenseFields);
    }

}
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { SelectFormOption } from "../../models/common/select-form-option.model";
import { TravelPerkUserRole } from "../../models/enum/enum.model";
import { TravelperkPaymentProfileSettingGet, TravelperkPaymentProfileSettingPost } from "../../models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TravelperkPaymentProfileSettingService {

  static getUserRoleOptions(): SelectFormOption[] {
      return [
          {
              label: 'Booker',
              value: TravelPerkUserRole.BOOKER
          },
          {
              label: 'Card holder',
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
      return this.constructPaymentProfileMapping(travelperkPaymentProfileSettingForm.get('paymentProfileMappings')?.value);
  }

}
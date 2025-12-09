import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SelectFormOption } from '../../../models/common/select-form-option.model';
import { TravelPerkUserRole } from '../../../models/enum/enum.model';
import {
  TravelperkPaymentProfileSettingGet,
  TravelperkPaymentProfileSettingPost,
} from '../../../models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class TravelperkPaymentProfileSettingsService {
  constructor(private translocoService: TranslocoService) {}

  getUserRoleOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.travelperkPaymentProfileSettings.booker'),
        value: TravelPerkUserRole.BOOKER,
      },
      {
        label: this.translocoService.translate('services.travelperkPaymentProfileSettings.cardHolder'),
        value: TravelPerkUserRole.CARD_HOLDER,
      },
      {
        label: this.translocoService.translate('services.travelperkPaymentProfileSettings.traveller'),
        value: TravelPerkUserRole.TRAVELLER,
      },
    ];
  }

  createFormGroup(data: TravelperkPaymentProfileSettingGet): FormGroup {
    return new FormGroup({
      destinationName: new FormControl(data.profile_name || ''),
      sourceName: new FormControl(data.user_role || null),
      isImportEnabled: new FormControl(data.is_import_enabled || false),
    });
  }

  constructFormArray(arrayData: TravelperkPaymentProfileSettingGet[]): FormGroup[] {
    const resultentArray: FormGroup[] = [];
    arrayData.forEach((data) => resultentArray.push(this.createFormGroup(data)));
    return resultentArray;
  }

  constructPaymentProfileMapping(paymentProfileFieldArray: any): TravelperkPaymentProfileSettingPost[] {
    const paymentProfileSettings = paymentProfileFieldArray.map((field: any) => {
      return {
        profile_name: field.destinationName,
        is_import_enabled: field.isImportEnabled,
        user_role: field.sourceName,
      };
    });

    return paymentProfileSettings;
  }

  mapAPIResponseToFormGroup(
    travelperkPaymentProfileSettingResponse: TravelperkPaymentProfileSettingGet[] | null,
  ): FormGroup {
    const paymentProfileMappingsArray = travelperkPaymentProfileSettingResponse
      ? this.constructFormArray(travelperkPaymentProfileSettingResponse)
      : [];
    return new FormGroup({
      paymentProfileMappings: new FormArray(paymentProfileMappingsArray),
    });
  }

  createPaymentProfileSettingPayload(travelperkPaymentProfileSettingForm: FormGroup) {
    return this.constructPaymentProfileMapping(
      travelperkPaymentProfileSettingForm.get('paymentProfileMappings')?.value,
    );
  }
}

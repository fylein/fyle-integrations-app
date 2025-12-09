import { SelectFormOption } from '../../common/select-form-option.model';
import { TravelPerkUserRole } from '../../enum/enum.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PaginatedResponse } from '../../db/paginated-response.model';

export type TravelperkPaymentProfileSetting = {
  profile_name: string;
  user_role: TravelPerkUserRole | null;
  is_import_enabled: boolean;
};

export interface TravelperkPaymentProfileSettingGet extends TravelperkPaymentProfileSetting {
  id: number;
  created_at: Date;
  updated_at: Date;
  org: number;
}

export interface TravelperkPaymentProfileSettingPost extends TravelperkPaymentProfileSetting {}

export interface TravelperkPaymentProfileSettingResponse extends PaginatedResponse {
  results: TravelperkPaymentProfileSettingGet[];
}

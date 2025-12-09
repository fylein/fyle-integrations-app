import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import {
  Sage300ImportSettingGet,
  Sage300ImportSettingPost,
} from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { ExpenseField, ImportCodeFieldConfigType } from 'src/app/core/models/common/import-settings.model';
import { ImportSettingsService } from '../../common/import-settings.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';

const sage300ImportSettingGetCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class Sage300ImportSettingsService extends ImportSettingsService {
  private apiService = inject(ApiService);

  private workspaceService = inject(WorkspaceService);

  private helper = inject(HelperService);

  constructor() {
    super();
    this.helper.setBaseApiURL();
  }

  static generateDependentFieldValue(attribute_type: string, source_placeholder: string): ExpenseField {
    return {
      attribute_type: attribute_type,
      display_name: attribute_type,
      source_placeholder: source_placeholder,
      is_dependent: true,
    };
  }

  mapAPIResponseToFormGroup(
    importSettings: Sage300ImportSettingGet | null,
    sage300Fields: IntegrationField[],
    importCodeFieldConfig: ImportCodeFieldConfigType,
  ): FormGroup {
    const importCode = importSettings?.import_settings?.import_code_fields
      ? importSettings?.import_settings?.import_code_fields
      : [];
    const expenseFieldsArray = importSettings?.mapping_settings
      ? this.constructFormArray(
          importSettings.mapping_settings,
          sage300Fields,
          importCodeFieldConfig,
          false,
          importCode,
        )
      : [];
    return new FormGroup({
      importCodeFields: new FormControl(
        importSettings?.import_settings?.import_code_fields ? importSettings?.import_settings.import_code_fields : [],
      ),
      importCategories: new FormControl(importSettings?.import_settings?.import_categories ?? false),
      importCategoryCode: new FormControl(this.getImportCodeField(importCode, 'ACCOUNT', importCodeFieldConfig)),
      importVendorAsMerchant: new FormControl(importSettings?.import_settings?.import_vendors_as_merchants ?? false),
      importVendorCode: new FormControl(this.getImportCodeField(importCode, 'VENDOR', importCodeFieldConfig)),
      expenseFields: new FormArray(expenseFieldsArray),
      isDependentImportEnabled: new FormControl(
        importSettings?.dependent_field_settings?.is_import_enabled
          ? importSettings.dependent_field_settings.is_import_enabled
          : false,
      ),
      costCodes: new FormControl(
        importSettings?.dependent_field_settings?.cost_code_field_name
          ? Sage300ImportSettingsService.generateDependentFieldValue(
              importSettings.dependent_field_settings.cost_code_field_name,
              importSettings.dependent_field_settings.cost_code_placeholder,
            )
          : null,
      ),
      costCategory: new FormControl(
        importSettings?.dependent_field_settings?.cost_category_field_name
          ? Sage300ImportSettingsService.generateDependentFieldValue(
              importSettings.dependent_field_settings.cost_category_field_name,
              importSettings.dependent_field_settings.cost_category_placeholder,
            )
          : null,
      ),
      addCommitmentDetails: new FormControl(importSettings?.import_settings?.add_commitment_details ?? false),
      dependentFieldImportToggle: new FormControl(true),
    });
  }

  createImportSettingPayload(
    importSettingsForm: FormGroup,
    importSettings: Sage300ImportSettingGet,
  ): Sage300ImportSettingPost {
    const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
    const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);

    return {
      import_settings: {
        import_categories: importSettingsForm.get('importCategories')?.value,
        import_vendors_as_merchants: importSettingsForm.get('importVendorAsMerchant')?.value,
        add_commitment_details: importSettingsForm.get('addCommitmentDetails')?.value,
        import_code_fields: importSettingsForm.get('importCodeFields')?.value,
      },
      mapping_settings: mappingSettings,
      dependent_field_settings:
        importSettingsForm.get('isDependentImportEnabled')?.value &&
        importSettingsForm.get('costCodes')?.value &&
        importSettingsForm.get('costCategory')?.value
          ? {
              cost_code_field_name: importSettingsForm.get('costCodes')?.value
                ? importSettingsForm.get('costCodes')?.value.attribute_type
                : importSettings?.dependent_field_settings?.cost_code_field_name
                  ? importSettings.dependent_field_settings?.cost_code_field_name
                  : null,
              cost_code_placeholder: importSettingsForm.get('costCodes')?.value
                ? importSettingsForm.get('costCodes')?.value.source_placeholder
                : importSettings?.dependent_field_settings?.cost_code_placeholder
                  ? importSettings.dependent_field_settings?.cost_code_placeholder
                  : null,
              cost_category_field_name: importSettingsForm.get('costCategory')?.value
                ? importSettingsForm.get('costCategory')?.value.attribute_type
                : importSettings?.dependent_field_settings?.cost_category_field_name
                  ? importSettings.dependent_field_settings?.cost_category_field_name
                  : null,
              cost_category_placeholder: importSettingsForm.get('costCategory')?.value
                ? importSettingsForm.get('costCategory')?.value.source_placeholder
                : importSettings?.dependent_field_settings?.cost_category_placeholder
                  ? importSettings.dependent_field_settings?.cost_category_placeholder
                  : null,
              is_import_enabled: importSettingsForm.get('isDependentImportEnabled')?.value,
            }
          : null,
    };
  }

  @Cacheable({
    cacheBusterObserver: sage300ImportSettingGetCache,
  })
  getSage300ImportSettings(): Observable<Sage300ImportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: sage300ImportSettingGetCache,
  })
  postImportSettings(importSettingsPayload: Sage300ImportSettingPost): Observable<Sage300ImportSettingGet> {
    return this.apiService.put(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`,
      importSettingsPayload,
    );
  }

  getImportCodeFieldConfig() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/import_settings/import_code_fields_config/`, {});
  }
}

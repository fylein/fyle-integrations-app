import { inject, Injectable } from '@angular/core';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { Observable, Subject } from 'rxjs';
import { QBOImportSettingGet, QBOImportSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { ApiService } from '../../common/api.service';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ImportSettingsService } from '../../common/import-settings.service';
import { ImportCodeFieldConfigType } from 'src/app/core/models/common/import-settings.model';

const qboImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QboImportSettingsService extends ImportSettingsService {

  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  static getChartOfAccountTypesList(): string[] {
    return [
      'Expense', 'Other Expense', 'Fixed Asset', 'Cost of Goods Sold', 'Current Liability', 'Equity',
      'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset', 'Income', 'Other Income'
    ];
  }

  static mapAPIResponseToFormGroup(importSettings: QBOImportSettingGet | null, qboFields: IntegrationField[], qboImportCodeFieldCodeConfig: ImportCodeFieldConfigType): FormGroup {
    const importCode = importSettings?.workspace_general_settings?.import_code_fields ? importSettings?.workspace_general_settings?.import_code_fields : [];
    const expenseFieldsArray = importSettings?.mapping_settings ? ImportSettingsService.constructFormArray(importSettings.mapping_settings, qboFields, qboImportCodeFieldCodeConfig) : [];
    return new FormGroup({
      importCategories: new FormControl(importSettings?.workspace_general_settings.import_categories ?? false),
      expenseFields: new FormArray(expenseFieldsArray),
      chartOfAccountTypes: new FormControl(importSettings?.workspace_general_settings.charts_of_accounts ? importSettings.workspace_general_settings.charts_of_accounts : ['Expense']),
      importItems: new FormControl(importSettings?.workspace_general_settings.import_items ?? false),
      taxCode: new FormControl(importSettings?.workspace_general_settings.import_tax_codes ?? false),
      importVendorsAsMerchants: new FormControl(importSettings?.workspace_general_settings.import_vendors_as_merchants ?? false),
      defaultTaxCode: new FormControl(importSettings?.general_mappings?.default_tax_code?.id ? importSettings.general_mappings.default_tax_code : null),
      searchOption: new FormControl(''),
      importCodeFields: new FormControl( importSettings?.workspace_general_settings?.import_code_fields ? importSettings.workspace_general_settings.import_code_fields : null),
      importCategoryCode: new FormControl(ImportSettingsService.getImportCodeField(importCode, 'ACCOUNT', qboImportCodeFieldCodeConfig))
    });
  }

  static constructPayload(importSettingsForm: FormGroup): QBOImportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
    const mappingSettings = ImportSettingsService.constructMappingSettingPayload(expenseFieldArray);

    return {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('importCategories')?.value,
        import_items: importSettingsForm.get('importItems')?.value,
        charts_of_accounts: importSettingsForm.get('chartOfAccountTypes')?.value,
        import_tax_codes: importSettingsForm.get('taxCode')?.value,
        import_vendors_as_merchants: importSettingsForm.get('importVendorsAsMerchants')?.value,
        import_code_fields: importSettingsForm.get('importCodeFields')?.value
      },
      mapping_settings: mappingSettings,
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? importSettingsForm.get('defaultTaxCode')?.value : emptyDestinationAttribute
      }
    };
  }

  @Cacheable({
    cacheBusterObserver: qboImportSettingGetCache$
  })
  getImportSettings(): Observable<QBOImportSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: qboImportSettingGetCache$
  })
  postImportSettings(importSettingsPayload: QBOImportSettingPost): Observable<QBOImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

  getQBOFields(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbo/fields/`, {});
  }

  getImportCodeFieldConfig() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/v2/workspaces/${workspaceId}/import_settings/import_code_fields_config/`, {});
  }
}

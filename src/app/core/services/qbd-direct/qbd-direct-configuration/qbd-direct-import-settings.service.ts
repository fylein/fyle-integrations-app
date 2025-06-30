import { inject, Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { ApiService } from '../../common/api.service';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { QbdDirectImportSettingGet, QbdDirectImportSettingPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { ImportCodeFieldConfigType } from 'src/app/core/models/common/import-settings.model';
import { ImportSettingsService } from '../../common/import-settings.service';
import { FormArray, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';

const qbdDirectImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QbdDirectImportSettingsService extends ImportSettingsService {
  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  private translocoService: TranslocoService = inject(TranslocoService);

  getChartOfAccountTypesList(): string[] {
    const typeList = [
      this.translocoService.translate('services.qbdDirectImportSettings.otherExpense'), this.translocoService.translate('services.qbdDirectImportSettings.costOfGoodsSold'), this.translocoService.translate('services.qbdDirectImportSettings.fixedAsset'), this.translocoService.translate('services.qbdDirectImportSettings.otherAsset'), this.translocoService.translate('services.qbdDirectImportSettings.otherCurrentAsset'),
      this.translocoService.translate('services.qbdDirectImportSettings.longTermLiability'), this.translocoService.translate('services.qbdDirectImportSettings.otherCurrentLiability'), this.translocoService.translate('services.qbdDirectImportSettings.income'), this.translocoService.translate('services.qbdDirectImportSettings.otherIncome'), this.translocoService.translate('services.qbdDirectImportSettings.equity')
    ].sort((a, b) => a.localeCompare(b));

    return [this.translocoService.translate('services.qbdDirectImportSettings.expense')].concat(typeList);
  }

  mapAPIResponseToFormGroup(importSettings: QbdDirectImportSettingGet | null, QbdDirectFields: IntegrationField[], QbdDirectImportCodeFieldCodeConfig: ImportCodeFieldConfigType): FormGroup {
    const importCode = importSettings?.import_settings?.import_code_fields ? importSettings?.import_settings?.import_code_fields : [];
    const expenseFieldsArray = importSettings?.mapping_settings ? ImportSettingsService.constructFormArray(importSettings?.mapping_settings, QbdDirectFields, QbdDirectImportCodeFieldCodeConfig) : [];
    return new FormGroup({
      importCategories: new FormControl(importSettings?.import_settings?.import_account_as_category ?? false),
      importItems: new FormControl(importSettings?.import_settings?.import_item_as_category ?? false),
      expenseFields: new FormArray(expenseFieldsArray),
      chartOfAccountTypes: new FormControl(importSettings?.import_settings?.chart_of_accounts ? importSettings.import_settings.chart_of_accounts.map(item => item.replace(/([a-z])([A-Z])/g, '$1 $2')) : [this.translocoService.translate('services.qbdDirectImportSettings.expense')]),
      importVendorsAsMerchants: new FormControl(importSettings?.import_settings?.import_vendor_as_merchant ?? false),
      searchOption: new FormControl(''),
      importCodeFields: new FormControl( importSettings?.import_settings?.import_code_fields ? importSettings.import_settings.import_code_fields : []),
      importCategoryCode: new FormControl(ImportSettingsService.getImportCodeField(importCode, 'ACCOUNT', QbdDirectImportCodeFieldCodeConfig)),
      workSpaceId: new FormControl(importSettings?.workspace_id)
    });
  }

  static constructPayload(importSettingsForm: FormGroup): QbdDirectImportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
    const mappingSettings = ImportSettingsService.constructMappingSettingPayload(expenseFieldArray);
    const coaArray = importSettingsForm.get('chartOfAccountTypes')?.value.map((item: string) => item.replace(/\s+/g, ''));

    return {
      import_settings: {
        import_account_as_category: importSettingsForm.get('importCategories')?.value,
        import_item_as_category: importSettingsForm.get('importItems')?.value,
        chart_of_accounts: coaArray,
        import_vendor_as_merchant: importSettingsForm.get('importVendorsAsMerchants')?.value,
        import_code_fields: importSettingsForm.get('importCodeFields')?.value
      },
      mapping_settings: mappingSettings,
      workspace_id: importSettingsForm.get('workSpaceId')?.value
    };
  }

  @Cacheable({
    cacheBusterObserver: qbdDirectImportSettingGetCache$
  })
  getImportSettings(): Observable<QbdDirectImportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: qbdDirectImportSettingGetCache$
  })
  postImportSettings(importSettingsPayload: QbdDirectImportSettingPost): Observable<QbdDirectImportSettingGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

  getQbdDirectFields(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd/fields/`, {});
  }

  getImportCodeFieldConfig(): Observable<ImportCodeFieldConfigType>{
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/import_code_fields_config/`, {});
  }
}

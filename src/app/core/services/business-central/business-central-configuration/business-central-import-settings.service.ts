import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { HelperService } from '../../common/helper.service';
import { Subject, Observable } from 'rxjs';
import { BusinessCentralImportSettingsGet, BusinessCentralImportSettingsPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-import-settings.model';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { ImportSettingsService } from '../../common/import-settings.service';

const businessCentralImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralImportSettingsService extends ImportSettingsService {
  private apiService: ApiService = inject(ApiService);
  private workspaceService: WorkspaceService = inject(WorkspaceService);
  private helper: HelperService = inject(HelperService);

  constructor() {
    super();
    this.helper.setBaseApiURL();
  }

  static mapAPIResponseToFormGroup(importSettings: BusinessCentralImportSettingsGet | null, businessCentralFields: IntegrationField[]): FormGroup {
    const expenseFieldsArray = importSettings?.mapping_settings ? ImportSettingsService.constructFormArray(importSettings.mapping_settings, businessCentralFields) : [] ;
    return new FormGroup({
        importCategories: new FormControl(importSettings?.import_settings?.import_categories ?? false),
        chartOfAccountTypes: new FormControl(importSettings?.import_settings?.charts_of_accounts ? importSettings?.import_settings?.charts_of_accounts : ['Expense']),
        importVendorAsMerchant: new FormControl(importSettings?.import_settings?.import_vendors_as_merchants ?? false ),
        expenseFields: new FormArray(expenseFieldsArray)
    });
  }

  static createImportSettingPayload(importSettingsForm: FormGroup): BusinessCentralImportSettingsPost {
      const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
      const mappingSettings = ImportSettingsService.constructMappingSettingPayload(expenseFieldArray);
      return {
          import_settings: {
              import_categories: importSettingsForm.get('importCategories')?.value,
              import_vendors_as_merchants: importSettingsForm.get('importVendorAsMerchant')?.value,
              charts_of_accounts: importSettingsForm.get('chartOfAccountTypes')?.value
          },
          mapping_settings: mappingSettings
      };
  }

  static getChartOfAccountTypesList() {
      return ['Expense', 'Assets', 'Income', 'Equity', 'Liabilities', 'Others', 'Cost of Goods Sold'];
  }

  @Cacheable({
    cacheBusterObserver: businessCentralImportSettingGetCache$
  })
  getBusinessCentralImportSettings(): Observable<BusinessCentralImportSettingsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: businessCentralImportSettingGetCache$
  })
  postBusinessCentralImportSettings(importSettingsPayload: BusinessCentralImportSettingsPost): Observable<BusinessCentralImportSettingsGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

}

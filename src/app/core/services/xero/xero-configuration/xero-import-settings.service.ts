import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { XeroImportSettingGet, XeroImportSettingPost } from 'src/app/core/models/xero/xero-configuration/xero-import-settings.model';
import { Observable, Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { FormArray, FormControl } from '@angular/forms';
import { ImportSettingsService } from '../../common/import-settings.service';
import { FormGroup } from '@angular/forms';
import { XeroFyleField } from 'src/app/core/models/enum/enum.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ExportSettingsService } from '../../common/export-settings.service';

const xeroImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class XeroImportSettingsService extends ImportSettingsService {

  private apiService = inject(ApiService);

  private workspaceService = inject(WorkspaceService);

  private exportSettingsService = inject(ExportSettingsService);

  static getChartOfAccountTypesList(): string[] {
    return ['EXPENSE', 'ASSET', 'EQUITY', 'LIABILITY', 'REVENUE'];
  }

  mapAPIResponseToFormGroup(importSettings: XeroImportSettingGet | null, xeroFields: IntegrationField[], isCustomerPresent:boolean, destinationAttribute: DestinationAttribute[]): FormGroup {
    let additionalOption: any[] = [];
    if (brandingFeatureConfig.featureFlags.importSettings.disableCustomerSourceField && isCustomerPresent) {
      const additionalMappingSetting = {
        source_field: 'DISABLED_XERO_SOURCE_FIELD',
        destination_field: XeroFyleField.CUSTOMER,
        import_to_fyle: importSettings?.workspace_general_settings.import_customers || false,
        is_custom: false,
        source_placeholder: null
      };
      additionalOption = [this.createFormGroup(additionalMappingSetting)];
    }
    const expenseFieldsArray = importSettings?.mapping_settings ? additionalOption.concat(this.constructFormArray(importSettings.mapping_settings, xeroFields)) : [];
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
    return new FormGroup({
      importCategories: new FormControl(importSettings?.workspace_general_settings.import_categories ?? false),
      expenseFields: new FormArray(expenseFieldsArray),
      chartOfAccountTypes: new FormControl(importSettings?.workspace_general_settings.charts_of_accounts ? importSettings.workspace_general_settings.charts_of_accounts.map((name: string) => name[0]+name.substr(1).toLowerCase()) : ['Expense']),
      importCustomers: new FormControl(importSettings?.workspace_general_settings.import_customers ?? false),
      taxCode: new FormControl(importSettings?.workspace_general_settings.import_tax_codes ?? false),
      importSuppliersAsMerchants: new FormControl(importSettings?.workspace_general_settings.import_suppliers_as_merchants ?? false),
      defaultTaxCode: new FormControl(importSettings?.general_mappings?.default_tax_code?.id ? findObjectByDestinationId(destinationAttribute, importSettings.general_mappings.default_tax_code.id) : null),
      searchOption: new FormControl('')
    });
  }

  constructPayload(importSettingsForm: FormGroup, isCloneSettings: boolean = false): XeroImportSettingPost {

    const emptyDestinationAttribute: DefaultDestinationAttribute = {id: null, name: null};
    const COA = importSettingsForm.get('chartOfAccountTypes')?.value.map((name: string) => name.toUpperCase());
    const expenseFieldArray = importSettingsForm.getRawValue().expenseFields.filter(((data:any) => data.destination_field !== XeroFyleField.CUSTOMER));
    const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);

    let defaultTaxCode = {...emptyDestinationAttribute};
    if (importSettingsForm.get('defaultTaxCode')?.value) {
      if (isCloneSettings) {
        defaultTaxCode = importSettingsForm.get('defaultTaxCode')?.value;
      } else {
        defaultTaxCode = this.exportSettingsService.formatGeneralMappingPayload(importSettingsForm.get('defaultTaxCode')?.value);
      }
    }
    const importSettingPayload: XeroImportSettingPost = {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('importCategories')?.value ?? false,
        charts_of_accounts: importSettingsForm.get('chartOfAccountTypes')?.value ? COA : ['EXPENSE'],
        import_tax_codes: importSettingsForm.get('taxCode')?.value,
        import_suppliers_as_merchants: importSettingsForm.get('importSuppliersAsMerchants')?.value,
        import_customers: importSettingsForm.get('importCustomers')?.value ? importSettingsForm.get('importCustomers')?.value : false
      },
      general_mappings: {
        default_tax_code: defaultTaxCode
      },
      mapping_settings: mappingSettings
    };
    return importSettingPayload;
  }

  @Cacheable({
    cacheBusterObserver: xeroImportSettingGetCache$
  })
  getImportSettings(): Observable<XeroImportSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroImportSettingGetCache$
  })
  postImportSettings(exportSettingsPayload: XeroImportSettingPost): Observable<XeroImportSettingGet>{
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, exportSettingsPayload);
  }

  getXeroField(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/xero/xero_fields/`, {});
  }
}

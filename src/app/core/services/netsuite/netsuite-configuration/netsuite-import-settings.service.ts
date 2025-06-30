import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { CustomSegment, NetsuiteImportSettingGet, NetsuiteImportSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-import-setting.model';
import { NetsuiteExportSettingsService } from './netsuite-export-settings.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ImportSettingsService } from '../../common/import-settings.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { NetsuiteCustomSegmentOption } from 'src/app/core/models/enum/enum.model';


const netsuiteImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class NetsuiteImportSettingsService extends ImportSettingsService {

  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  static getCustomSegmentOptions(): SelectFormOption[] {
    return [
      {
        label: 'Custom list',
        value: NetsuiteCustomSegmentOption.CUSTOM_LIST
      },
      {
        label: 'Custom record',
        value: NetsuiteCustomSegmentOption.CUSTOM_RECORD
      },
      {
        label: 'Custom segment',
        value: NetsuiteCustomSegmentOption.CUSTOM_SEGMENT
      }
    ];
  }

  static constructCustomSegmentPayload(customSegmentForm: FormGroup, workspaceId: number): CustomSegment {
    return {
      segment_type: customSegmentForm.get('customFieldType')?.value,
      script_id: customSegmentForm.get('scriptId')?.value,
      internal_id: customSegmentForm.get('internalId')?.value,
      workspace: workspaceId
    };
  }

  static mapAPIResponseToFormGroup(importSettings: NetsuiteImportSettingGet | null, netsuiteFields: IntegrationField[], destinationAttribute: DestinationAttribute[]): FormGroup {
    const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, netsuiteFields) : [];
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
    return new FormGroup({
      importCategories: new FormControl(importSettings?.configuration.import_categories ?? false),
      expenseFields: new FormArray(expenseFieldsArray),
      importItems: new FormControl(importSettings?.configuration.import_items ?? false),
      taxCode: new FormControl(importSettings?.configuration.import_tax_items ?? false),
      importVendorsAsMerchants: new FormControl(importSettings?.configuration.import_vendors_as_merchants ?? false),
      importNetsuiteEmployees: new FormControl(importSettings?.configuration.import_netsuite_employees ?? false),
      defaultTaxCode: new FormControl(importSettings?.general_mappings?.default_tax_code?.id ? findObjectByDestinationId(destinationAttribute, importSettings.general_mappings.default_tax_code.id) : null),
      searchOption: new FormControl('')
    });
  }

  static constructPayload(importSettingsForm: FormGroup): NetsuiteImportSettingPost {
    const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
    const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);
    const emptyDestinationAttribute = {id: null, name: null};

    return {
      configuration: {
        import_categories: importSettingsForm.get('importCategories')?.value,
        import_tax_items: importSettingsForm.get('taxCode')?.value,
        import_items: importSettingsForm.get('importItems')?.value ? importSettingsForm.get('importItems')?.value : false,
        import_vendors_as_merchants: importSettingsForm.get('importVendorsAsMerchants')?.value,
        import_netsuite_employees: importSettingsForm.get('importNetsuiteEmployees')?.value
      },
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? NetsuiteExportSettingsService.formatGeneralMappingPayload(importSettingsForm.get('defaultTaxCode')?.value) : emptyDestinationAttribute
      },
      mapping_settings: mappingSettings
    };
  }

  @Cacheable({
    cacheBusterObserver: netsuiteImportSettingGetCache$
  })
  getImportSettings(): Observable<NetsuiteImportSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: netsuiteImportSettingGetCache$
  })
  postImportSettings(importSettingsPayload: NetsuiteImportSettingPost): Observable<NetsuiteImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

  getNetsuiteFields(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/netsuite/netsuite_fields/`, {});
  }

  postNetsuiteCustomSegments(customSegmentsPayload: CustomSegment): Observable<CustomSegment> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/netsuite/custom_segments/`, customSegmentsPayload);
  }
}

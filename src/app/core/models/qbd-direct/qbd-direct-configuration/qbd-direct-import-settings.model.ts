import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportCodeFieldConfigType, ImportSettingMappingRow } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";
import { ImportSettingsService } from "src/app/core/services/common/import-settings.service";

export type QdbDirectImportSetting = {
    import_account_as_category: boolean,
    import_item_as_category: boolean,
    import_vendor_as_merchant: boolean,
    chart_of_accounts: string[],
    import_code_fields: string[]
  }

  export type QbdDirectImportSettingPost = {
    import_settings: QdbDirectImportSetting,
    mapping_settings: ImportSettingMappingRow[],
    workspace_id: number;
  }

export interface QbdDirectImportSettingGet extends QbdDirectImportSettingPost {}

export class QbdDirectImportSettingModel extends ImportSettingsService {
    static getChartOfAccountTypesList(): string[] {
      const typeList = [
        'Other Expense', 'Cost Of Goods Sold', 'Fixed Asset', 'Other Asset', 'Other Current Asset',
        'Long Term Liability', 'Other Current Liability', 'Income', 'Other Income', 'Equity'
      ].sort((a, b) => a.localeCompare(b));

      return ['Expense'].concat(typeList);
    }

    static mapAPIResponseToFormGroup(importSettings: QbdDirectImportSettingGet | null, QbdDirectFields: IntegrationField[], QbdDirectImportCodeFieldCodeConfig: ImportCodeFieldConfigType): FormGroup {
      const importCode = importSettings?.import_settings?.import_code_fields ? importSettings?.import_settings?.import_code_fields : [];
      const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings?.mapping_settings, QbdDirectFields, QbdDirectImportCodeFieldCodeConfig) : [];
      return new FormGroup({
        importCategories: new FormControl(importSettings?.import_settings?.import_account_as_category ?? false),
        importItems: new FormControl(importSettings?.import_settings?.import_item_as_category ?? false),
        expenseFields: new FormArray(expenseFieldsArray),
        chartOfAccountTypes: new FormControl(importSettings?.import_settings?.chart_of_accounts ? importSettings.import_settings.chart_of_accounts.map(item => item.replace(/([a-z])([A-Z])/g, '$1 $2')) : ['Expense']),
        importVendorsAsMerchants: new FormControl(importSettings?.import_settings?.import_vendor_as_merchant ?? false),
        searchOption: new FormControl(''),
        importCodeFields: new FormControl( importSettings?.import_settings?.import_code_fields ? importSettings.import_settings.import_code_fields : []),
        importCategoryCode: new FormControl(this.getImportCodeField(importCode, 'ACCOUNT', QbdDirectImportCodeFieldCodeConfig)),
        workSpaceId: new FormControl(importSettings?.workspace_id)
      });
    }

    static constructPayload(importSettingsForm: FormGroup): QbdDirectImportSettingPost {
      const emptyDestinationAttribute = {id: null, name: null};
      const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
      const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);
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
  }
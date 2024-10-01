import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportCodeFieldConfigType, ImportSettingMappingRow, ImportSettingsModel } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";

export type QdbDirectImportSettingWorkspaceGeneralSetting = {
    import_categories: boolean,
    import_items: boolean,
    import_vendors_as_merchants: boolean,
    charts_of_accounts: string[],
    import_code_fields: string[]
  }

  export type QbdDirectImportSettingPost = {
    workspace_general_settings: QdbDirectImportSettingWorkspaceGeneralSetting,
    mapping_settings: ImportSettingMappingRow[] | []
  }

export interface QbdDirectImportSettingGet extends QbdDirectImportSettingPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number;
}

export class QbdDirectImportSettingModel extends ImportSettingsModel {
    static getChartOfAccountTypesList(): string[] {
      return [
        'Expense', 'Other Expense', 'Cost of Goods Sold', 'Fixed Asset', 'Other Asset', 'Other Current Asset',
        'Long Term Liability', 'Other Current Liability', 'Income', 'Other Income', 'Equity'
      ];
    }

    static mapAPIResponseToFormGroup(importSettings: QbdDirectImportSettingGet | null, QbdDirectFields: IntegrationField[], QbdDirectImportCodeFieldCodeConfig: ImportCodeFieldConfigType): FormGroup {
      const importCode = importSettings?.workspace_general_settings?.import_code_fields ? importSettings?.workspace_general_settings?.import_code_fields : [];
      const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, QbdDirectFields, QbdDirectImportCodeFieldCodeConfig) : [];
      return new FormGroup({
        importCategories: new FormControl(importSettings?.workspace_general_settings.import_categories ?? false),
        expenseFields: new FormArray(expenseFieldsArray),
        chartOfAccountTypes: new FormControl(importSettings?.workspace_general_settings.charts_of_accounts ? importSettings.workspace_general_settings.charts_of_accounts : ['Expense']),
        importItems: new FormControl(importSettings?.workspace_general_settings.import_items ?? false),
        importVendorsAsMerchants: new FormControl(importSettings?.workspace_general_settings.import_vendors_as_merchants ?? false),
        searchOption: new FormControl(''),
        importCodeFields: new FormControl( importSettings?.workspace_general_settings?.import_code_fields ? importSettings.workspace_general_settings.import_code_fields : null),
        importCategoryCode: new FormControl(this.getImportCodeField(importCode, 'ACCOUNT', QbdDirectImportCodeFieldCodeConfig))
      });
    }

    static constructPayload(importSettingsForm: FormGroup): QbdDirectImportSettingPost {
      const emptyDestinationAttribute = {id: null, name: null};
      const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
      const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);

      return {
        workspace_general_settings: {
          import_categories: importSettingsForm.get('importCategories')?.value,
          import_items: importSettingsForm.get('importItems')?.value,
          charts_of_accounts: importSettingsForm.get('chartOfAccountTypes')?.value,
          import_vendors_as_merchants: importSettingsForm.get('importVendorsAsMerchants')?.value,
          import_code_fields: importSettingsForm.get('importCodeFields')?.value
        },
        mapping_settings: mappingSettings
      };
    }
  }
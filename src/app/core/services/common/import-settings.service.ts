import { inject, Injectable } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ImportSettingMappingRow } from "../../models/common/import-settings.model";
import { IntegrationField } from "../../models/db/mapping.model";
import { ImportCodeFieldConfigType, ExpenseField } from "../../models/common/import-settings.model";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { TranslocoService } from "@jsverse/transloco";

@Injectable({
  providedIn: 'root'
})
export class ImportSettingsService {

  protected translocoService: TranslocoService = inject(TranslocoService);

  getCustomFieldOption(): ExpenseField[] {
    return [{ attribute_type: 'custom_field', display_name: this.translocoService.translate('services.importSettings.createCustomField'), source_placeholder: null, is_dependent: false }];
  }

  createFormGroup(data: ImportSettingMappingRow): FormGroup {
    return new FormGroup ({
      source_field: new FormControl(data.source_field || '', RxwebValidators.unique()),
      destination_field: new FormControl(data.destination_field || '', RxwebValidators.unique()),
      import_to_fyle: new FormControl(data.import_to_fyle || false),
      is_custom: new FormControl(data.is_custom || false),
      source_placeholder: new FormControl(data.source_placeholder || null),
      import_code: new FormControl(data.import_code)
    });
  }

  getImportCodeField(importCodeFields: string[], destinationField: string, importCodeFieldCodeConfig: ImportCodeFieldConfigType): boolean | null {
    if (importCodeFields?.includes(destinationField)) {
      return importCodeFields?.includes(destinationField);
    } else if (!importCodeFieldCodeConfig[destinationField]) {
      return false;
    }
    return null;
  }

  constructFormArray(importSettingsMappingSettings: ImportSettingMappingRow[], accountingAppFields: IntegrationField[], importCodeFieldCodeConfig?: ImportCodeFieldConfigType, isDestinationFixedImport: boolean = true, importCodeFields: string[] | [] = []): FormGroup[] {
    const expenseFieldFormArray: FormGroup[] = [];
    const mappedFieldMap = new Map<string, any>();
    const unmappedFieldMap = new Map<string, any>();

    // First loop to populate mappedFieldMap
    accountingAppFields.forEach((accountingAppField) => {
      const mappingSetting = importSettingsMappingSettings.find(
        (setting) => setting.destination_field === accountingAppField.attribute_type
      );

      const fieldData = mappingSetting || {
          destination_field: accountingAppField.attribute_type,
          import_to_fyle: false,
          is_custom: false,
          source_field: '',
          source_placeholder: null,
          import_code: null
      };
      if (mappingSetting) {
        fieldData.import_code = importCodeFieldCodeConfig ? this.getImportCodeField(importCodeFields, accountingAppField.attribute_type, importCodeFieldCodeConfig) : null;
        mappedFieldMap.set(accountingAppField.attribute_type, fieldData);
      } else {
          unmappedFieldMap.set(accountingAppField.attribute_type, fieldData);
      }
    });

    // Handle only mapped fields
    accountingAppFields.forEach((accountingAppField) => {
      const fieldData = mappedFieldMap.get(accountingAppField.attribute_type);
      if (fieldData) {
        expenseFieldFormArray.push(this.createFormGroup(fieldData));
      }
    });

    if (expenseFieldFormArray.length < 3 || isDestinationFixedImport) {
      accountingAppFields.forEach((accountingAppField) => {
        const fieldData = unmappedFieldMap.get(accountingAppField.attribute_type);
        if (fieldData) {
          expenseFieldFormArray.push(this.createFormGroup(fieldData));
        }
      });
    }

    return expenseFieldFormArray;
  }

  constructMappingSettingPayload(expenseFieldArray: ImportSettingMappingRow[]): ImportSettingMappingRow[] {
    const filteredExpenseFieldArray = expenseFieldArray.filter((field: ImportSettingMappingRow) => field.destination_field && field.source_field);
    const mappingSettings = filteredExpenseFieldArray.map((field: ImportSettingMappingRow) => {
      return {
        source_field: field.source_field.toUpperCase(),
        destination_field: field.destination_field,
        import_to_fyle: field.import_to_fyle,
        is_custom: (field.source_field.toUpperCase() === 'PROJECT' || field.source_field.toUpperCase() === 'COST_CENTER') ? false : true,
        source_placeholder: field.source_placeholder
      };
    });

    return mappingSettings;
  }
}

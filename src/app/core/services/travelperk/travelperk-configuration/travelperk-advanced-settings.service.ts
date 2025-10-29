  import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { SelectFormOption, SelectFormLabel } from "src/app/core/models/common/select-form-option.model";
import { TravelPerkExpenseGroup } from "../../../models/enum/enum.model";
import { TravelperkAdvancedSettingGet, TravelperkAdvancedSettingPost, TravelperkAdvancedSettingArray, TravelperkAdvancedSettingFormArray, TravelperkCategoryMapping } from "../../../models/travelperk/travelperk-configuration/travelperk-advanced-settings.model";
import { TravelperkDestinationAttribuite } from "../../../models/travelperk/travelperk.model";
import { TranslocoService } from "@jsverse/transloco";

@Injectable({
  providedIn: 'root'
})
export class TravelperkAdvancedSettingsService {

  constructor(
    private translocoService: TranslocoService
  ) { }

  getDefaultCategory(): SelectFormLabel[] {
      return [
          {
              label: this.translocoService.translate('services.travelperkAdvancedSettings.cars'),
              value: 'Cars'
          },
          {
              label: this.translocoService.translate('services.travelperkAdvancedSettings.flights'),
              value: 'Flights'
          },
          {
              label: this.translocoService.translate('services.travelperkAdvancedSettings.hotels'),
              value: 'Hotels'
          },
          {
              label: this.translocoService.translate('services.travelperkAdvancedSettings.trains'),
              value: 'Trains'
          }
      ];
  }

  getExpenseGroup(): SelectFormOption[] {
      return [
          {
              label: this.translocoService.translate('services.travelperkAdvancedSettings.singleExpense'),
              value: TravelPerkExpenseGroup.SINGLE
          },
          {
              label: this.translocoService.translate('services.travelperkAdvancedSettings.multipleExpenses'),
              value: TravelPerkExpenseGroup.MULTIPLE
          }
      ];
  }

  createFormGroup(data: TravelperkAdvancedSettingArray): FormGroup {
      return new FormGroup ({
          destinationName: new FormControl(data.destination_name || '', Validators.required),
          sourceName: new FormControl(data.source_name || null, Validators.required),
          isRequired: new FormControl(true)
      });
  }

  constructFormArray(arrayData: TravelperkAdvancedSettingGet, source_fields: TravelperkDestinationAttribuite[]): FormGroup[] {
      const mappingPayload:FormGroup[] = [];
      const defaultCategories = this.getDefaultCategory();
      const categoryMapping = Object.keys(arrayData.category_mappings);
      Object.entries(arrayData.category_mappings).forEach((value, index) => {
          const findObjectByDestinationId = (array: TravelperkDestinationAttribuite[], id: string) => array?.find(item => item.source_id === id) || null;
          const data: TravelperkAdvancedSettingArray = {
              destination_name: {
                  label: categoryMapping[index] ? categoryMapping[index] : defaultCategories[index].label,
                  value: categoryMapping[index] ? categoryMapping[index] : defaultCategories[index].value
              },
              source_name: arrayData.category_mappings[categoryMapping[index]] ? findObjectByDestinationId(source_fields, arrayData.category_mappings[categoryMapping[index]].id) : null
          };
          mappingPayload.push(this.createFormGroup(data));
      });
      return mappingPayload;
  }

  constructCategoryMapping(categoryMappingFieldArray: TravelperkAdvancedSettingFormArray[]) {
      const data:TravelperkCategoryMapping = {};
      categoryMappingFieldArray.forEach((item: TravelperkAdvancedSettingFormArray) => {
          data[item.destinationName.value] = {
              'name': item.sourceName?.value ? item.sourceName.value : '',
              'id': item.sourceName?.source_id ? item.sourceName.source_id : ''
          };
      });

      return data;
  }

  mapAPIResponseToFormGroup(advancedSettings: TravelperkAdvancedSettingGet | null, sourceOptions: TravelperkDestinationAttribuite[]): FormGroup {
      const defaultMemoOptions: string[] =['trip_id', 'trip_name', 'traveler_name', 'booker_name', 'merchant_name'];
      const categoryMappings = advancedSettings ? this.constructFormArray(advancedSettings, sourceOptions) : [] ;
      const findObjectByDestinationId = (array: TravelperkDestinationAttribuite[], id: string) => array?.find(item => item.source_id === id) || null;
      return new FormGroup({
          categoryMappings: new FormArray(categoryMappings),
          descriptionStructure: new FormControl(advancedSettings?.description_structure ? advancedSettings?.description_structure : defaultMemoOptions),
          defaultEmployee: new FormControl(advancedSettings?.default_employee_name ? advancedSettings?.default_employee_name : null),
          defaultEmployeeId: new FormControl(advancedSettings?.default_employee_id ? advancedSettings?.default_employee_id : null),
          defaultCategory: new FormControl(advancedSettings?.default_category_name ? findObjectByDestinationId(sourceOptions, advancedSettings.default_category_id) : null, Validators.required),
          invoiceLineitemStructure: new FormControl(advancedSettings?.invoice_lineitem_structure ? advancedSettings.invoice_lineitem_structure : null, Validators.required),
          searchOption: new FormControl('')
      });
  }

  createAdvancedSettingPayload(advancedSettingsForm: FormGroup): TravelperkAdvancedSettingPost {
      return {
          default_employee_name: advancedSettingsForm.get('defaultEmployee')?.value ? advancedSettingsForm.get('defaultEmployee')?.value : null,
          default_employee_id: advancedSettingsForm.get('defaultEmployeeId')?.value ? advancedSettingsForm.get('defaultEmployeeId')?.value : null,
          default_category_name: advancedSettingsForm.get('defaultCategory')?.value ? advancedSettingsForm.get('defaultCategory')?.value.value : null,
          default_category_id: advancedSettingsForm.get('defaultCategory')?.value ? advancedSettingsForm.get('defaultCategory')?.value.source_id : null,
          description_structure: advancedSettingsForm.get('descriptionStructure')?.value ? advancedSettingsForm.get('descriptionStructure')?.value : null,
          invoice_lineitem_structure: advancedSettingsForm.get('invoiceLineitemStructure')?.value ? advancedSettingsForm.get('invoiceLineitemStructure')?.value : null,
          category_mappings: this.constructCategoryMapping(advancedSettingsForm.get('categoryMappings')?.value)
      };
  }
}

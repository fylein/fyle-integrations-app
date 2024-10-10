import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { TravelPerkExpenseGroup } from "../../enum/enum.model";
import { SelectFormLabel, SelectFormOption } from "../../common/select-form-option.model";
import { TravelperkDestinationAttribuite } from "../travelperk.model";

interface TravelperkCategoryMapping {
    [key: string]:  {
        id: string;
        name: string;
    };
}

export type TravelperkAdvancedSetting = {
    default_employee_name: string,
	default_employee_id: string,
	default_category_name: string,
	default_category_id: string,
	description_structure: string[],
	invoice_lineitem_structure: TravelPerkExpenseGroup,
    category_mappings: TravelperkCategoryMapping
}

export interface TravelperkAdvancedSettingGet extends TravelperkAdvancedSetting {
    id: number,
    created_at: Date,
    updated_at: Date,
    org: number
}

type TravelperkAdvancedSettingArray = {
    destination_name: SelectFormLabel;
    source_name: TravelperkDestinationAttribuite | null;
}

type TravelperkAdvancedSettingFormArray = {
    destinationName: SelectFormLabel;
    sourceName: TravelperkDestinationAttribuite | null;
}

export interface TravelperkAdvancedSettingPost extends TravelperkAdvancedSetting { }

export class TravelperkAdvancedSettingModel {

    static getDefaultCategory(): SelectFormLabel[] {
        return [
            {
                label: 'Cars',
                value: 'Cars'
            },
            {
                label: 'Flights',
                value: 'Flights'
            },
            {
                label: 'Hotels',
                value: 'Hotels'
            },
            {
                label: 'Trains',
                value: 'Trains'
            }
        ];
    }

    static getExpenseGroup(): SelectFormOption[] {
        return [
            {
                label: 'Single Expense',
                value: TravelPerkExpenseGroup.SINGLE
            },
            {
                label: 'Multiple Expenses',
                value: TravelPerkExpenseGroup.MULTIPLE
            }
        ];
    }

    static createFormGroup(data: TravelperkAdvancedSettingArray): FormGroup {
        return new FormGroup ({
            destinationName: new FormControl(data.destination_name || '', Validators.required),
            sourceName: new FormControl(data.source_name || null, Validators.required),
            isRequired: new FormControl(true)
        });
    }

    static constructFormArray(arrayData: TravelperkAdvancedSettingGet, source_fields: TravelperkDestinationAttribuite[]): FormGroup[] {
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

    static constructCategoryMapping(categoryMappingFieldArray: TravelperkAdvancedSettingFormArray[]) {
        const data:TravelperkCategoryMapping = {};
        categoryMappingFieldArray.forEach((item: TravelperkAdvancedSettingFormArray) => {
            data[item.destinationName.value] = {
                'name': item.sourceName?.value ? item.sourceName.value : '',
                'id': item.sourceName?.source_id ? item.sourceName.source_id : ''
            };
        });

        return data;
    }

    static mapAPIResponseToFormGroup(advancedSettings: TravelperkAdvancedSettingGet | null, sourceOptions: TravelperkDestinationAttribuite[]): FormGroup {
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

    static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): TravelperkAdvancedSettingPost {
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

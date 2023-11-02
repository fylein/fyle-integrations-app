import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';
import { IntegrationFields } from 'src/app/core/models/db/mapping.model';
import { MappingSetting } from 'src/app/core/models/si/si-configuration/import-settings.model';

@Component({
  selector: 'app-configuration-import-field',
  templateUrl: './configuration-import-field.component.html',
  styleUrls: ['./configuration-import-field.component.scss']
})
export class ConfigurationImportFieldComponent implements OnInit {

  @Input() appName: string = 'Sage 300 CRE';

  @Input() form: FormGroup;

  @Input() accountingFieldOptions: IntegrationFields[];
  
  @Input() fyleFieldOptions: IntegrationFields[];

  @Input() showAddmore: boolean;

  @Input() showTaxGroupDropdown: boolean;

  @Input() isMappingFields: boolean;

  onCustomFieldAddition: boolean;

  onAddMoreClick: boolean;

  expenseFields: FormArray;

  importSettingsForm: any;

  showAddButton: any;
  customFieldControl: AbstractControl<any, any>;
  
  customFieldForm: any;
  showDialog: boolean;
  costCodeFieldOption: any[];
  costTypeFieldOption: any[];
  isCostCodeFieldSelected: boolean;
  customFieldForDependentField: boolean;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  addExpenseField() {
    this.expenseFields = this.importSettingsForm.get('expenseFields') as FormArray;
    const defaultFieldData: MappingSetting = {
      source_field: '',
      destination_field: '',
      import_to_fyle: true,
      is_custom: false,
      source_placeholder: null
    };
    this.expenseFields.push(this.createFormGroup(defaultFieldData));
    this.importSettingWatcher();
    this.showAddButton = this.showOrHideAddButton();
  }
  private createFormGroup(data: MappingSetting): FormGroup {
    return this.formBuilder.group({
      source_field: [data.source_field || '', RxwebValidators.unique()],
      destination_field: [data.destination_field || '', RxwebValidators.unique()],
      import_to_fyle: [data.import_to_fyle || false],
      is_custom: [data.is_custom || false],
      source_placeholder: [data.source_placeholder || null]
    });
  }
  private importSettingWatcher(): void {
    const expenseFieldArray = this.importSettingsForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control) => {
      control.valueChanges.subscribe(value => {
        if (value.source_field === 'custom_field') {
         this.addCustomField();
         this.customFieldControl = control;
         this.customFieldControl.patchValue({
            source_field: '',
            destination_field: control.value.destination_field,
            import_to_fyle: control.value.import_to_fyle,
            is_custom: control.value.is_custom,
            source_placeholder: null
          });
        }
      });
    });
    this.importSettingsForm.controls.importTaxCodes?.valueChanges.subscribe((isImportTaxEnabled: any) => {
      if (isImportTaxEnabled) {
        this.importSettingsForm.controls?.sageIntacctTaxCodes.setValidators([Validators.required]);
      } else {
        this.importSettingsForm.controls.sageIntacctTaxCodes.clearValidators();
        this.importSettingsForm.controls.sageIntacctTaxCodes.updateValueAndValidity();
      }
    });
    this.costCodesCostTypesWatcher();
  }
  private addCustomField() {
    this.customFieldForm = this.formBuilder.group({
      attribute_type: [null, Validators.required],
      display_name: [null],
      source_placeholder: [null, Validators.required]
    });
    this.showDialog = true;
  }
  private costCodesCostTypesWatcher(): void {
    if (this.importSettingsForm.value.costCodes) {
      this.costCodeFieldOption = [this.importSettingsForm.value.costCodes];
      this.importSettingsForm.controls.costCodes.disable();
    }

    if (this.importSettingsForm.value.costTypes) {
      this.costTypeFieldOption = [this.importSettingsForm.value.costTypes];
      this.importSettingsForm.controls.costTypes.disable();
    }

    if (this.importSettingsForm.value.isDependentImportEnabled) {
      this.importSettingsForm.controls.costCodes.disable();
      this.importSettingsForm.controls.costTypes.disable();
    }

    this.importSettingsForm.controls.isDependentImportEnabled.valueChanges.subscribe((isDependentImportEnabled: any) => {
      if (isDependentImportEnabled) {
        this.importSettingsForm.controls.costCodes.enable();
        this.importSettingsForm.controls.costTypes.enable();
        this.importSettingsForm.controls.costCodes.setValidators(Validators.required);
        this.importSettingsForm.controls.costTypes.setValidators(Validators.required);
      } else {
        this.importSettingsForm.controls.costCodes.disable();
      this.importSettingsForm.controls.costTypes.disable();
        this.importSettingsForm.controls.costCodes.clearValidators();
        this.importSettingsForm.controls.costTypes.clearValidators();
      }
    });

    this.importSettingsForm.controls.costCodes.valueChanges.subscribe((value: { attribute_type: string; source_field: string; }) => {
      this.isCostCodeFieldSelected = true;
      if (value?.attribute_type === 'custom_field') {
        this.customFieldForDependentField = true;
        this.addCustomField();
        this.customFieldControl = this.importSettingsForm.controls.costCodes;
        if (value.source_field === 'custom_field') {
          this.importSettingsForm.controls.costCodes.patchValue({
              source_field: null
            });
        }
        }
    });

    this.importSettingsForm.controls.costTypes.valueChanges.subscribe((value: { attribute_type: string; source_field: string; }) => {
      this.isCostCodeFieldSelected = false;
      if (value?.attribute_type === 'custom_field') {
        this.customFieldForDependentField = true;
        this.addCustomField();
        this.customFieldControl = this.importSettingsForm.controls.costTypes;
        if (value.source_field === 'custom_field') {
          this.importSettingsForm.controls.costTypes.patchValue({
              source_field: null
            });
        }
        }
    });
  }

  showOrHideAddButton() {
    if (this.importSettingsForm.controls.expenseFields.value.length === this.accountingFieldOptions.length) {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
  }

}

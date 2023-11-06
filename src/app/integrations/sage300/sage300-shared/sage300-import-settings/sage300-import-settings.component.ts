import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, DefaultImportFields } from 'src/app/core/models/enum/enum.model';
import { Sage300ImportSettingGet, Sage300DefaultFields, Sage300ImportSettingModel } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { ImportSettingMappingRow } from 'src/app/core/models/common/import-settings.model';
import { IntegrationField, FyleField } from 'src/app/core/models/db/mapping.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { Sage300ImportSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-import-settings.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';
import { FyleFields, IntegrationFields, importSettings } from '../fixture';

@Component({
  selector: 'app-sage300-import-settings',
  templateUrl: './sage300-import-settings.component.html',
  styleUrls: ['./sage300-import-settings.component.scss']
})
export class Sage300ImportSettingsComponent implements OnInit {

  isOnboarding: boolean;

  importSettings: Sage300ImportSettingGet | null | any;

  importSettingForm: FormGroup;

  isLoading: boolean = true;

  fyleFields: FyleField[];

  sage300Fields: IntegrationField[];

  customFieldForm: FormGroup;

  showCustomFieldDialog: boolean;

  isPreviewDialogVisible: boolean;

  customFieldControl: AbstractControl;

  isDependentFieldAllowed: boolean;

  appName: string = AppName.SAGE300;

  customField: any;

  costCodeFieldOption = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null, is_dependent: true }];

  costCategoryOption = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null, is_dependent: true }];

  readonly defaultImportFields: Sage300DefaultFields[] = [
    {
      source_field: DefaultImportFields.CATEGORY,
      destination_field: DefaultImportFields.ACCOUNT,
      formController: 'importCategories'
    },
    {
      source_field: DefaultImportFields.MERCHANTS,
      destination_field: DefaultImportFields.VENDOR,
      formController: 'importVendorAsMerchant'
    }
  ];

  constructor(
    private router: Router,
    private importSettingService: Sage300ImportSettingsService,
    private mappingService: MappingService,
    private helperService: Sage300HelperService,
    private formBuilder: FormBuilder,
    private helper: HelperService
  ) { }

  private dependentCostFieldsWatchers(formControllerName: string): void {
    this.importSettingForm.controls[formControllerName].valueChanges.subscribe((value) => {
      if (value?.attribute_type === 'custom_field') {
        this.addCustomField();
        this.customFieldControl = this.importSettingForm.controls.costCodes;
        if (value.source_field === 'custom_field') {
          this.importSettingForm.controls.costCodes.patchValue({
              source_field: null
            });
        }
        }
    });

  }

  private dependentFieldWatchers(): void {
    if (this.importSettingForm.value.costCodes) {
      this.helper.disableFormField(this.importSettingForm, 'costCodes');
    }

    if (this.importSettingForm.value.costCategory) {
      this.helper.disableFormField(this.importSettingForm, 'costCategory');
    }

    if (this.importSettingForm.value.isDependentImportEnabled) {
      this.helper.disableFormField(this.importSettingForm, 'costCodes');
      this.helper.disableFormField(this.importSettingForm, 'costCategory');
    }

    this.importSettingForm.controls.isDependentImportEnabled.valueChanges.subscribe((isDependentImportEnabled) => {
      if (isDependentImportEnabled) {
        this.helper.enableFormField(this.importSettingForm, 'costCodes');
        this.helper.enableFormField(this.importSettingForm, 'costCategory');
        this.helper.markControllerAsRequired(this.importSettingForm, 'costCodes');
        this.helper.markControllerAsRequired(this.importSettingForm, 'costCategory');
      } else {
        this.helper.disableFormField(this.importSettingForm, 'costCodes');
        this.helper.disableFormField(this.importSettingForm, 'costCategory');
        this.helper.clearValidatorAndResetValue(this.importSettingForm, 'costCodes');
        this.helper.clearValidatorAndResetValue(this.importSettingForm, 'costCategory');
      }
    });

    this.dependentCostFieldsWatchers('costCodes');
    this.dependentCostFieldsWatchers('costCategory');
  }

  private addCustomField() {
    this.customFieldForm = this.formBuilder.group({
      attribute_type: [null, Validators.required],
      display_name: [null],
      source_placeholder: [null, Validators.required]
    });
    this.showCustomFieldDialog = true;
  }

  showDependentField() {
    const expenseFieldArray = this.importSettingForm.get('expenseFields') as FormArray;
    expenseFieldArray.value[0].forEach((val: any) => {
      if (val.value.source_field === 'PROJECT' && val.value.destination_field === 'PROJECT') {
        this.isDependentFieldAllowed = true;
      }
    });
  }

  private importSettingWatcher(): void {
    const expenseFieldArray = this.importSettingForm.get('expenseFields') as FormArray;
    expenseFieldArray.value[0].forEach((control:any) => {
      control.valueChanges.subscribe((value: { source_field: string; destination_field: string; }) => {
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
        } else if (value.source_field === 'PROJECT' && value.destination_field === 'PROJECT') {
          this.isDependentFieldAllowed = true;
        }
      });
    });
  }

  showPreviewDialog(visible: boolean) {
    this.isPreviewDialogVisible = visible;
  }

  showOrHideAddButton() {
    if (this.importSettingForm.controls.expenseFields.value.length === this.sage300Fields.length) {
      return false;
    }
    return true;
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  isExpenseFieldDependent(expenseField: ImportSettingMappingRow): boolean {
    const isDependent = this.fyleFields.find(field => field.attribute_type === expenseField.source_field);
    return isDependent ? true : false;
  }

  dependentFieldFormCreation(){
    const mappingSettings = this.importSettings?.mapping_settings;

    if (mappingSettings) {
      for (const setting of mappingSettings) {
        const { source_field, destination_field, import_to_fyle } = setting;
        if (source_field === 'PROJECT' && destination_field === 'PROJECT' && import_to_fyle === true) {
          if (this.importSettings?.dependent_field_settings?.is_import_enabled) {
            this.customField = {
              attribute_type: this.importSettings.dependent_field_settings.cost_code_field_name,
              display_name: this.importSettings.dependent_field_settings.cost_code_field_name,
              source_placeholder: this.importSettings.dependent_field_settings.cost_code_placeholder,
              is_dependent: true
            };
            this.costCodeFieldOption.push(this.customField);
            this.customField = {
              attribute_type: this.importSettings.dependent_field_settings.cost_category_field_name,
              display_name: this.importSettings.dependent_field_settings.cost_category_field_name,
              source_placeholder: this.importSettings.dependent_field_settings.cost_category_placeholder,
              is_dependent: true
            };
            this.costCategoryOption.push(this.customField);
          }
          break;
        }
      }
    }
  }

  private setupFormWatchers() {
    this.importSettingWatcher();
    this.dependentFieldWatchers();
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    // ForkJoin([
    //   This.importSettingService.getSage300ImportSettings().pipe(catchError(() => of(null))),
    //   This.mappingService.getFyleFields(),
    //   This.mappingService.getIntegrationsFields(AppNameInService.SAGE300)
    //   // This.mappingService.getGroupedDestinationAttributes([Sage300Field.TAX_DETAIL], AppNameInService.SAGE300)
    // ]).subscribe(([importSettingsResponse, fyleFieldsResponse, sage300FieldsResponse]) => {
      this.importSettings = importSettings;
      this.importSettingForm = Sage300ImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, IntegrationFields);
      this.fyleFields = FyleFields;
      this.sage300Fields = IntegrationFields;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: 'Create a Custom Field', is_dependent: true })
      this.setupFormWatchers();
      this.showDependentField();
      this.dependentFieldFormCreation();
      this.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

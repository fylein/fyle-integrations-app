import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { IntegrationFields } from 'src/app/core/models/db/mapping.model';
import { AccountingIntegrationApp, AppName, AppNameInService, DefaultImportFields, FyleField, Sage300Field } from 'src/app/core/models/enum/enum.model';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';
import { ImportSettingModel, Sage300ImportSettingGet, Sage300MappingSettings, Sage300DefaultFields } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { Sage300ImportSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-import-settings.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';

@Component({
  selector: 'app-sage300-import-settings',
  templateUrl: './sage300-import-settings.component.html',
  styleUrls: ['./sage300-import-settings.component.scss']
})
export class Sage300ImportSettingsComponent implements OnInit {

  isOnboarding: boolean;

  importSettings: Sage300ImportSettingGet;

  importSettingForm: FormGroup;

  isLoading: boolean = true;

  fyleFields: IntegrationFields[];

  sage300Fields: IntegrationFields[];

  customFieldForm: FormGroup;

  showCustomFieldDialog: boolean;

  isPreviewDialogVisible: boolean;

  customFieldControl: AbstractControl;

  isShowDependentField: boolean;

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

  private costCodescostCategoryWatcher(): void {
    if (this.importSettingForm.value.costCodes) {
      this.helper.disableFormFields(this.importSettingForm, 'costCodes');
    }

    if (this.importSettingForm.value.costCategory) {
      this.helper.disableFormFields(this.importSettingForm, 'costCategory');
    }

    if (this.importSettingForm.value.isDependentImportEnabled) {
      this.helper.disableFormFields(this.importSettingForm, 'costCodes');
      this.helper.disableFormFields(this.importSettingForm, 'costCategory');
    }

    this.importSettingForm.controls.isDependentImportEnabled.valueChanges.subscribe((isDependentImportEnabled) => {
      if (isDependentImportEnabled) {
        this.helper.enableFormFields(this.importSettingForm, 'costCodes');
        this.helper.enableFormFields(this.importSettingForm, 'costCategory');
        this.helper.markControllerAsRequired(this.importSettingForm, 'costCodes');
        this.helper.markControllerAsRequired(this.importSettingForm, 'costCategory');
      } else {
        this.helper.disableFormFields(this.importSettingForm, 'costCodes');
        this.helper.disableFormFields(this.importSettingForm, 'costCategory');
        this.helper.clearValidatorAndResetValue(this.importSettingForm, 'costCodes');
        this.helper.clearValidatorAndResetValue(this.importSettingForm, 'costCategory');
      }
    });

    this.importSettingForm.controls.costCodes.valueChanges.subscribe((value) => {
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

    this.importSettingForm.controls.costCategory.valueChanges.subscribe((value) => {
      if (value?.attribute_type === 'custom_field') {
        this.addCustomField();
        this.customFieldControl = this.importSettingForm.controls.costCategory;
        if (value.source_field === 'custom_field') {
          this.importSettingForm.controls.costCategory.patchValue({
              source_field: null
            });
        }
        }
    });
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
        this.isShowDependentField = true;
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
          this.isShowDependentField = true;
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

  isExpenseFieldDependent(expenseField: Sage300MappingSettings): boolean {
    const isDependent = this.fyleFields.find(field => field.attribute_type === expenseField.source_field);
    return isDependent ? true : false;
  }

  dependentFieldFormCreation(){
    const mappingSettings: Sage300MappingSettings[] = this.importSettings.mapping_settings;

        for (const setting of mappingSettings) {
          const { source_field, destination_field, import_to_fyle } = setting;
          if (source_field === 'PROJECT' && destination_field === 'PROJECT' && import_to_fyle === true) {
            if (this.importSettings.dependent_field_settings?.is_import_enabled) {
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

  private importSettingFormWatcher() {
    this.importSettingWatcher();
    this.costCodescostCategoryWatcher();
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getSage300ImportSettings().pipe(catchError(() => of(null))),
      this.mappingService.getFyleFields(),
      this.mappingService.getIntegrationsFields(AppNameInService.SAGE300),
      this.mappingService.getGroupedDestinationAttributes([Sage300Field.TAX_DETAIL], AppNameInService.SAGE300)
    ]).subscribe(([response]) => {
      this.importSettings = response[0];
      this.importSettingForm = ImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, response[2]);
      this.fyleFields = response[1];
      this.sage300Fields = response[2];
      this.importSettingFormWatcher();
      this.showDependentField();
      this.dependentFieldFormCreation();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { ImportSettingMappingRow } from 'src/app/core/models/common/import-settings.model';
import { IntegrationField, FyleField } from 'src/app/core/models/db/mapping.model';
import { AppNameInService } from 'src/app/core/models/enum/enum.model';
import { Sage300ImportSettingModel, Sage300ImportSettingGet} from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
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

  importSettings: Sage300ImportSettingGet | null;

  importSettingForm: FormGroup;

  isLoading: boolean = true;

  fyleFields: FyleField[];

  sage300Fields: IntegrationField[];

  customFieldForm: FormGroup;

  showCustomFieldDialog: boolean;

  isPreviewDialogVisible: boolean;

  customFieldControl: AbstractControl;

  isDependentFieldAllowed: boolean;

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

  private setupFormWatchers() {
    this.importSettingWatcher();
    this.dependentFieldWatchers();
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getSage300ImportSettings().pipe(catchError(() => of(null))),
      this.mappingService.getFyleFields(),
      this.mappingService.getIntegrationsFields(AppNameInService.SAGE300)
      // This.mappingService.getGroupedDestinationAttributes([Sage300Field.TAX_DETAIL], AppNameInService.SAGE300)
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, sage300FieldsResponse]) => {
      this.importSettings = importSettingsResponse;
      this.importSettingForm = Sage300ImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, sage300FieldsResponse);
      this.fyleFields = fyleFieldsResponse;
      this.sage300Fields = sage300FieldsResponse;
      this.setupFormWatchers();
      this.showDependentField();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

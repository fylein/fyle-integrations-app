import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ClickEvent, ConfigurationCta, IntacctOnboardingState, IntacctUpdateEvent, Page, ProgressPhase, RedirectLink, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExpenseField } from 'src/app/core/models/si/misc/expense-field.model';
import { ImportSettingGet, ImportSettings, MappingSetting } from 'src/app/core/models/si/si-configuration/import-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiImportSettingService } from 'src/app/core/services/si/si-configuration/si-import-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-configuration-import-settings',
  templateUrl: './configuration-import-settings.component.html',
  styleUrls: ['./configuration-import-settings.component.scss']
})
export class ConfigurationImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  importSettingsForm: FormGroup;

  customFieldForm: FormGroup;

  expenseFields: FormArray;

  RedirectLink = RedirectLink;

  saveInProgress: boolean = false;

  isOnboarding: boolean;

  ConfigurationCtaText = ConfigurationCta;

  importSettings: ImportSettingGet;

  sageIntacctTaxGroup: DestinationAttribute[];

  sageIntacctFields: ExpenseField[];

  fyleFields: ExpenseField[];

  showAddButton: boolean = true;

  toggleSwitchTrue: boolean = true;

  showCostCodeCostType: boolean = false;

  showPaymentOrAccount: string;

  showDialog: boolean;

  customField: ExpenseField;

  customFieldControl: AbstractControl;

  private sessionStartTime = new Date();

  customFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field',display_name: 'Create a Custom Field' }];

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private importSettingService: SiImportSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService
  ) { }

  get expenseFieldsGetter() {
    return this.importSettingsForm.get('expenseFields') as FormArray;
  }

  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  

  createExpenseField(sourceField: string = '', destinationField: string = '', isCustom: boolean = false, importToFyle: boolean = false, parentField: string = '') {
    const formControllers = {
      source_field: [sourceField ? sourceField : ''],
      destination_field: [destinationField ? destinationField : '', [Validators.required]],
      import_to_fyle: [importToFyle],
      is_custom: [isCustom]
    };

    const group = this.formBuilder.group(formControllers);

    return group;
  }

  uniqueFieldsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const fyleFieldSet = new Set();
      const sageIntacctFieldSet = new Set();
  
      for (let field of formArray.value) {
        if (field.source_field && fyleFieldSet.has(field.source_field)) {
          return { 'duplicateFyleFields': true };
        }
        if (field.destination_field && sageIntacctFieldSet.has(field.destination_field)) {
          return { 'duplicateSageIntacctFields': true };
        }
        if (field.source_field) {
          fyleFieldSet.add(field.source_field);
        }
        if (field.destination_field) {
          sageIntacctFieldSet.add(field.destination_field);
        }
      }
      return null;
    };
  }

  showOrHideAddButton() {
    if (this.importSettingsForm.controls.expenseFields.value.length === this.sageIntacctFields.length) {
      return false;
    }
    return true;
  }

  addExpenseField() {
    this.expenseFields = this.importSettingsForm.get('expenseFields') as FormArray;
    const defaultFieldData: MappingSetting = {
      source_field: '',
      destination_field: '',
      import_to_fyle: false,
      is_custom: false,
      source_placeholder: null
    };
    this.expenseFields.push(this.createFormGroup(defaultFieldData));
    this.showAddButton = this.showOrHideAddButton();
  }

  closeModel() {
    this.customFieldForm.reset();
    this.showDialog = false;
  }

  saveCustomField() {
    this.customField = this.customFieldForm.value;
    if (this.customFieldControl) {
      this.fyleFields.pop();
      this.fyleFields.push(this.customField);
      this.fyleFields.push(this.customFieldOption[0]);
      this.customFieldControl.patchValue({
        source_field: this.customField.attribute_type
      });
    
    this.customFieldControl.value.import_to_fyle = true;
    this.customFieldControl.value.is_custom = true;
    (<FormGroup>this.customFieldControl).controls['import_to_fyle'].setValue(true);
    (<FormGroup>this.customFieldControl).controls['is_custom'].setValue(true);
    (<FormGroup>this.customFieldControl).controls['source_field'].disable();
    (<FormGroup>this.customFieldControl).controls['import_to_fyle'].disable();
    this.customFieldForm.reset();
    this.showDialog = false;
    }
  }

  private addCustomField() {
    this.customFieldForm = this.formBuilder.group({
      display_name: [null, Validators.required],
      attribute_type: [null, Validators.required]
    });
    this.showDialog=true;
  };

  private costCodesCostTypesWatcher(): void {
    this.importSettingsForm.controls.expenseFields.valueChanges.subscribe((expenseField) => {
      if (expenseField[0].destination_field==='PROJECT' && expenseField[0].source_field==='PROJECT' && expenseField[0].import_to_fyle) {
        this.showCostCodeCostType = true;
      } else {
          this.showCostCodeCostType = false;
      }
    });
  }

  private importSettingWatcher(): void {
    const expenseFieldArray = this.importSettingsForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control, index) => {
      control.valueChanges.subscribe(value => {    
        if (value.source_field === 'custom_field') {
         this.addCustomField();
         this.customFieldControl = control;
         if (value.source_field === 'custom_field') {
              control.patchValue({
              source_field: null
            });
         }
        }
      });
    });
    this.importSettingsForm?.controls?.importTaxCodes?.valueChanges.subscribe((isImportTaxEnabled) => {
      if (!isImportTaxEnabled) {
        this.importSettingsForm?.controls?.sageIntacctTaxCodes?.setValue(null);
      }
    });
    this.costCodesCostTypesWatcher();
  }

  private createFormGroup(data: MappingSetting): FormGroup {
    return this.formBuilder.group({
      source_field: [data.source_field || '', [Validators.required]],
      destination_field: [data.destination_field || '', [Validators.required]],
      import_to_fyle: [data.import_to_fyle || false],
      is_custom: [data.is_custom || false]
    });
  }

  // Main function to construct form array
  private constructFormArray(): FormGroup[] {
    const expenseFieldFormArray: FormGroup[] = [];
    const fieldMap = new Map<string, any>();

    // First loop to populate fieldMap
    this.sageIntacctFields.forEach((sageIntacctField) => {
      const mappingSetting = this.importSettings.mapping_settings.find(
        (setting) => setting.destination_field === sageIntacctField.attribute_type
      );

      const fieldData = mappingSetting || {
        destination_field: sageIntacctField.attribute_type,
        import_to_fyle: false,
        is_custom: false,
        source_field: ''
      };

      fieldMap.set(sageIntacctField.attribute_type, fieldData);
    });

    // Handle top priority fields
    const topPriorityFields = ['PROJECT', 'DEPARTMENT', 'LOCATION'];
    topPriorityFields.forEach((field) => {
      const fieldData = fieldMap.get(field) || {
        destination_field: '',
        import_to_fyle: false,
        is_custom: false,
        source_field: ''
      };
      expenseFieldFormArray.push(this.createFormGroup(fieldData));
    });

    // Handle remaining fields
    if (expenseFieldFormArray.length < 3) {
      this.sageIntacctFields.forEach((sageIntacctField) => {
        if (expenseFieldFormArray.length < 3) {
          const fieldData = fieldMap.get(sageIntacctField.attribute_type);
          expenseFieldFormArray.push(this.createFormGroup(fieldData));
        }
      });
    }

    return expenseFieldFormArray;
  }

  private getSettingsAndSetupForm(): void {
    const destinationAttributes = ['TAX_DETAIL'];

    const sageIntacctFieldsObservable = this.mappingService.getSageIntacctFields();
    const fyleFieldsObservable = this.mappingService.getFyleFields();
    const groupedAttributesObservable = this.mappingService.getGroupedDestinationAttributes(destinationAttributes);
    const importSettingsObservable = this.importSettingService.getImportSettings();
    const configuration = this.mappingService.getConfiguration();

    forkJoin([
      sageIntacctFieldsObservable,
      fyleFieldsObservable,
      groupedAttributesObservable,
      importSettingsObservable,
      configuration
    ]).subscribe(
      ([sageIntacctFields, fyleFields, groupedAttributesResponse, importSettings, configuration]) => {
        this.sageIntacctFields = sageIntacctFields.map(field => {
          return {
            ...field,
            display_name: this.toTitleCase(field.display_name)
          };
        });
        this.fyleFields = fyleFields;
        this.fyleFields.push(this.customFieldOption[0]);
        this.sageIntacctTaxGroup = groupedAttributesResponse.TAX_DETAIL;
        this.importSettings = importSettings;
        if (configuration.employee_field_mapping==='EMPLOYEE') {
          this.showPaymentOrAccount = 'Payment';
        } else {
          this.showPaymentOrAccount = 'Account';
        }
        this.importSettingsForm = this.formBuilder.group({
          importVendorAsMerchant: [importSettings.configurations.import_vendors_as_merchants || null],
          importCategories: [importSettings.configurations.import_categories || null],
          importTaxCodes: [importSettings.configurations.import_tax_codes || null],
          sageIntacctTaxCodes: [(this.sageIntacctTaxGroup?.find(taxGroup => taxGroup.id.toString() === this.importSettings?.general_mappings?.default_tax_code?.id)) || null],
          expenseFields: this.formBuilder.array(this.constructFormArray(), this.uniqueFieldsValidator())
        });
        this.importSettingWatcher();
        this.costCodesCostTypesWatcher();
        this.isLoading = false;
      }
    );
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  save(): void {
    this.saveInProgress = true;
    const importSettingPayload = ImportSettings.constructPayload(this.importSettingsForm);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe((response: ImportSettingGet) => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      this.trackingService.trackTimeSpent(Page.IMPORT_SETTINGS_INTACCT, this.sessionStartTime);
      if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.IMPORT_SETTINGS) {
        this.trackingService.integrationsOnboardingCompletion(IntacctOnboardingState.IMPORT_SETTINGS, 2, importSettingPayload);
      } else {
        this.trackingService.intacctUpdateEvent(
          IntacctUpdateEvent.ADVANCED_SETTINGS_INTACCT,
          {
            phase: this.getPhase(),
            oldState: this.importSettings,
            newState: response
          }
        );
      }
      this.saveInProgress = false;
      if (this.isOnboarding) {
        this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.ADVANCED_SETTINGS);
        this.router.navigate([`/integrations/intacct/onboarding/advanced_settings`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
      });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { IntacctCategoryDestination, ConfigurationCta, IntacctOnboardingState, IntacctUpdateEvent, Page, ProgressPhase, RedirectLink, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExpenseField } from 'src/app/core/models/si/db/expense-field.model';
import { LocationEntityMapping } from 'src/app/core/models/si/db/location-entity-mapping.model';
import { DependentFieldSetting, ImportSettingGet, ImportSettingPost, ImportSettings, MappingSetting } from 'src/app/core/models/si/si-configuration/import-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiImportSettingService } from 'src/app/core/services/si/si-configuration/si-import-setting.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
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

  intacctCategoryDestination: IntacctCategoryDestination;

  showDialog: boolean;

  customField: ExpenseField;

  customFieldControl: AbstractControl;

  customFieldForDependentField: boolean = false;

  private sessionStartTime = new Date();

  dependentFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null }];

  costCodeFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null }];

  private isCostCodeFieldSelected: boolean = false;

  costTypeFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null }];

  customFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null }];

  dependentFieldSettings: DependentFieldSetting | null;

  isImportTaxVisible: boolean = true;

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private connectorService: IntacctConnectorService,
    private importSettingService: SiImportSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private storageService: StorageService,
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

  uniqueFieldsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const fyleFieldSet = new Set();
      const sageIntacctFieldSet = new Set();

      for (const field of formArray.value) {
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
    this.importSettingWatcher();
    this.showAddButton = this.showOrHideAddButton();
  }

  closeModel() {
    this.customFieldForm.reset();
    this.showDialog = false;
  }

  saveCustomField() {
    if (this.customFieldForDependentField) {
      this.customField = {
        attribute_type: this.customFieldForm.value.attribute_type.replace(/([A-Z])/g, "_$1").toLowerCase(),
        display_name: this.customFieldForm.value.attribute_type,
        source_placeholder: this.customFieldForm.value.source_placeholder
      };
      if (this.customFieldControl) {
        if (this.isCostCodeFieldSelected) {
          this.costCodeFieldOption.push(this.customField);
        } else {
          this.costTypeFieldOption.push(this.customField);
        }
        this.customFieldControl.patchValue({
          attribute_type: this.customFieldForm.value.attribute_type.replace(/([A-Z])/g, "_$1").toLowerCase(),
          display_name: this.customFieldForm.value.attribute_type,
          source_placeholder: this.customFieldForm.value.source_placeholder
        });
      this.customFieldControl.value.is_custom = true;
      this.customFieldForm.reset();
      this.showDialog = false;
      }
      this.customFieldControl.disable();
      this.customFieldForDependentField = false;
    } else {
      this.customField = {
        attribute_type: this.customFieldForm.value.attribute_type.split(' ').join('_').toUpperCase(),
        display_name: this.customFieldForm.value.attribute_type,
        source_placeholder: this.customFieldForm.value.source_placeholder
      };

      if (this.customFieldControl) {
        this.fyleFields.pop();
        this.fyleFields.push(this.customField);
        this.fyleFields.push(this.customFieldOption[0]);
        const expenseField = {
          source_field: this.customField.attribute_type,
          destination_field: this.customFieldControl.value.destination_field,
          import_to_fyle: true,
          is_custom: true,
          source_placeholder: this.customField.source_placeholder
        };
        (this.importSettingsForm.get('expenseFields') as FormArray).controls.filter(field => field.value.destination_field === this.customFieldControl.value.destination_field)[0].patchValue(expenseField);
        this.customFieldForm.reset();
        this.showDialog = false;
      }
    }
  }

  private costCodesCostTypesWatcher(): void {
    this.importSettingsForm.controls.expenseFields.valueChanges.subscribe((expenseField) => {
      if (expenseField[0].destination_field==='PROJECT' && expenseField[0].source_field==='PROJECT' && expenseField[0].import_to_fyle) {
        this.showCostCodeCostType = true;
      } else {
          this.showCostCodeCostType = false;
          this.importSettingsForm.controls.isDependentImportEnabled.setValue(null);
          this.importSettingsForm.controls.costCodes.setValue(null);
          this.importSettingsForm.controls.costTypes.setValue(null);
      }
    });

    if (this.importSettingsForm.value.isDependentImportEnabled) {
      this.importSettingsForm.controls.costCodes.disable();
      this.importSettingsForm.controls.costTypes.disable();
    }

    this.importSettingsForm.controls.isDependentImportEnabled.valueChanges.subscribe((isDependentImportEnabled) => {
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

    this.importSettingsForm.controls.costCodes.valueChanges.subscribe((value) => {
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

    this.importSettingsForm.controls.costTypes.valueChanges.subscribe((value) => {
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

  private addCustomField() {
    this.customFieldForm = this.formBuilder.group({
      attribute_type: [null, Validators.required],
      display_name: [null],
      source_placeholder: [null, Validators.required]
    });
    this.showDialog=true;
  }

  private importSettingWatcher(): void {
    const expenseFieldArray = this.importSettingsForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control, index) => {
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
    this.importSettingsForm.controls.importTaxCodes?.valueChanges.subscribe((isImportTaxEnabled) => {
      if (isImportTaxEnabled) {
        this.importSettingsForm.controls?.sageIntacctTaxCodes.setValidators([Validators.required]);
      } else {
        this.importSettingsForm.controls.sageIntacctTaxCodes.clearValidators();
        this.importSettingsForm.controls.sageIntacctTaxCodes.updateValueAndValidity();
      }
    });
    this.costCodesCostTypesWatcher();
  }

  private createFormGroup(data: MappingSetting): FormGroup {
    return this.formBuilder.group({
      source_field: [data.source_field || ''],
      destination_field: [data.destination_field || '', [Validators.required]],
      import_to_fyle: [data.import_to_fyle || false],
      is_custom: [data.is_custom || false],
      source_placeholder: [data.source_placeholder || null]
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
        source_field: '',
        source_placeholder: null
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
        source_field: '',
        source_placeholder: null
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

  private generateDependentFieldValue(attribute_type: string, source_placeholder: string): ExpenseField {
    return {
      attribute_type: attribute_type,
      display_name: attribute_type,
      source_placeholder: source_placeholder
    };
  }

  showImportTax(locationEntity: LocationEntityMapping) {
    return locationEntity.country_name==='United States' || locationEntity.destination_id==='top_level' ? false : true;
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    const destinationAttributes = ['TAX_DETAIL'];

    const sageIntacctFieldsObservable = this.mappingService.getSageIntacctFields();
    const fyleFieldsObservable = this.mappingService.getFyleFields();
    const groupedAttributesObservable = this.mappingService.getGroupedDestinationAttributes(destinationAttributes);
    const importSettingsObservable = this.importSettingService.getImportSettings();
    const configuration = this.mappingService.getConfiguration();
    const locationEntity = this.connectorService.getLocationEntityMapping();

    forkJoin([
      sageIntacctFieldsObservable,
      fyleFieldsObservable,
      groupedAttributesObservable,
      importSettingsObservable,
      configuration,
      locationEntity
    ]).subscribe(
      ([sageIntacctFields, fyleFields, groupedAttributesResponse, importSettings, configuration, locationEntity]) => {
        this.dependentFieldSettings = importSettings.dependent_field_settings;
        this.isImportTaxVisible = this.showImportTax(locationEntity);
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

        const mappingSettings: MappingSetting[] = this.importSettings.mapping_settings;

        for (const setting of mappingSettings) {
          const { source_field, destination_field, import_to_fyle } = setting;
          if (source_field === 'PROJECT' && destination_field === 'PROJECT' && import_to_fyle === true) {
            this.showCostCodeCostType = true;
            if (importSettings.dependent_field_settings?.is_import_enabled) {
              this.customField = {
                attribute_type: importSettings.dependent_field_settings.cost_code_field_name,
                display_name: importSettings.dependent_field_settings.cost_code_field_name,
                source_placeholder: importSettings.dependent_field_settings.cost_code_placeholder
              };
              this.costCodeFieldOption.push(this.customField);
              this.customField = {
                attribute_type: importSettings.dependent_field_settings.cost_type_field_name,
                display_name: importSettings.dependent_field_settings.cost_type_field_name,
                source_placeholder: importSettings.dependent_field_settings.cost_type_placeholder
              };
              this.costTypeFieldOption.push(this.customField);
            }
            break;
          }
        }

        if (configuration.employee_field_mapping==='EMPLOYEE') {
          this.intacctCategoryDestination = IntacctCategoryDestination.EXPENSE_TYPE;
        } else {
          this.intacctCategoryDestination = IntacctCategoryDestination.ACCOUNT;
        }
        this.importSettingsForm = this.formBuilder.group({
          importVendorAsMerchant: [importSettings.configurations.import_vendors_as_merchants || null],
          importCategories: [importSettings.configurations.import_categories || null],
          importTaxCodes: [importSettings.configurations.import_tax_codes || null],
          costCodes: [importSettings.dependent_field_settings?.is_import_enabled ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_code_field_name, importSettings.dependent_field_settings.cost_code_placeholder) : null],
          dependentFieldImportToggle: [true],
          workspaceId: this.storageService.get('si.workspaceId'),
          costTypes: [importSettings.dependent_field_settings?.is_import_enabled ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_type_field_name, importSettings.dependent_field_settings.cost_type_placeholder) : null],
          isDependentImportEnabled: [importSettings.dependent_field_settings?.is_import_enabled || null],
          sageIntacctTaxCodes: [(this.sageIntacctTaxGroup?.find(taxGroup => taxGroup.id.toString() === this.importSettings?.general_mappings?.default_tax_code?.id)) || null, importSettings.configurations.import_tax_codes ? [Validators.required] : []],
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
    const importSettingPayload = ImportSettings.constructPayload(this.importSettingsForm, this.dependentFieldSettings);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe((response: ImportSettingPost) => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      this.trackingService.trackTimeSpent(Page.IMPORT_SETTINGS_INTACCT, this.sessionStartTime);
      if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.IMPORT_SETTINGS) {
        this.trackingService.integrationsOnboardingCompletion(IntacctOnboardingState.IMPORT_SETTINGS, 3, importSettingPayload);
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
        this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.ADVANCED_CONFIGURATION);
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

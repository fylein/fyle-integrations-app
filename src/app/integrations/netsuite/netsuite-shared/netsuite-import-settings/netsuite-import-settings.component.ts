import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ExpenseField, ImportSettingsModel } from 'src/app/core/models/common/import-settings.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, NetsuiteFyleField, NetsuiteOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { NetsuiteConfiguration } from 'src/app/core/models/netsuite/db/netsuite-workspace-general-settings.model';
import { NetsuiteImportSettingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-import-setting.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';
import { NetsuiteImportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-import-settings.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';

@Component({
  selector: 'app-netsuite-import-settings',
  templateUrl: './netsuite-import-settings.component.html',
  styleUrls: ['./netsuite-import-settings.component.scss']
})
export class NetsuiteImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.NETSUITE.IMPORT_SETTING;

  isOnboarding: boolean;

  brandingConfig = brandingConfig;

  appName: AppName = AppName.NETSUITE;

  importSettingForm: FormGroup;

  isTaxGroupSyncAllowed: boolean;

  taxCodes: DestinationAttribute[];

  isImportMerchantsAllowed: boolean;

  isImportEmployeeAllowed: boolean;

  netsuiteFields: IntegrationField[];

  fyleFields: FyleField[];

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  showCustomFieldDialog: boolean;

  isPreviewDialogVisible: boolean;

  customField: ExpenseField;

  customFieldType: string;

  customFieldControl: AbstractControl;

  customFieldOption: ExpenseField[] = ImportSettingsModel.getCustomFieldOption();

  importSettings: any;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.netsuite.configuration.importSetting;

  constructor(
    private formBuilder: FormBuilder,
    private helperService: NetsuiteHelperService,
    private importSettingService: NetsuiteImportSettingsService,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private netsuiteExportSettingService: NetsuiteExportSettingsService,
    private netsuiteConnectorService: NetsuiteConnectorService,
    private workspaceService: WorkspaceService,
    private router: Router
  ) { }

  save() {
    this.isSaveInProgress = true;
    const importSettingPayload = NetsuiteImportSettingModel.constructPayload(this.importSettingForm);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe(() => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Import settings saved successfully');

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(NetsuiteOnboardingState.ADVANCED_CONFIGURATION);
        this.router.navigate([`/integrations/netsuite/onboarding/advanced_settings`]);
      }
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
    });
  }


  closeModel() {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = false;
  }

  showPreviewDialog(visible: boolean) {
    this.isPreviewDialogVisible = visible;
  }

  closeDialog() {
    this.isPreviewDialogVisible = false;
  }

  saveFyleExpenseField(): void {
    this.customField = {
      attribute_type: this.customFieldForm.value.attribute_type.split(' ').join('_').toUpperCase(),
      display_name: this.customFieldForm.value.attribute_type,
      source_placeholder: this.customFieldForm.value.source_placeholder,
      is_dependent: false
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
      (this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.value.destination_field === this.customFieldControl.value.destination_field)[0].patchValue(expenseField);
      ((this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.value.destination_field === this.customFieldControl.value.destination_field)[0] as FormGroup).controls.import_to_fyle.disable();
      this.customFieldForm.reset();
      this.showCustomFieldDialog = false;
    }
  }

  private initializeCustomFieldForm(shouldShowDialog: boolean) {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = shouldShowDialog;
  }

  private setupFormWatchers(): void {
    const expenseFieldArray = this.importSettingForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control:any) => {
      control.valueChanges.subscribe((value: { source_field: string; destination_field: string; }) => {
        if (value.source_field === 'custom_field') {
          this.initializeCustomFieldForm(true);
          this.customFieldType = '';
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
  }

  navigateToPreviousStep(): void {
  this.router.navigate([`/integrations/netsuite/onboarding/export_settings`]);
  }

  refreshDimensions() {
    this.helperService.refreshNetsuiteDimensions().subscribe();
  }

  getCategoryLabel(): string {
    if (this.importSettings.configuration.import_netsuite_employee) {
      return 'Import the Expense Categories';
    }
    return 'Import the Accounts';
  }

  getCategorySubLabel(): string {
    if (this.importSettings.configuration.import_netsuite_employee) {
      return 'Imported expense categories';
    }
    return 'Imported accounts';
  }


  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleFields(),
      this.netsuiteConnectorService.getSubsidiaryMapping(),
      this.importSettingService.getNetsuiteFields(),
      this.netsuiteExportSettingService.getExportSettings(),
      this.mappingService.getDestinationAttributes(NetsuiteFyleField.TAX_CODE, 'v2')
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, subsidiaryMapping, netsuiteFields, exportSetting, destinationAttribute]) => {
      this.importSettings = importSettingsResponse;
      if (subsidiaryMapping && subsidiaryMapping.country_name !== '_unitedStates') {
        this.isTaxGroupSyncAllowed = true;
      }

      if (exportSetting.configuration.employee_field_mapping === 'EMPLOYEE'){
        this.isImportEmployeeAllowed = true;
      }

      this.netsuiteFields = netsuiteFields;
      this.importSettingForm = NetsuiteImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, this.netsuiteFields, this.taxCodes);
      this.taxCodes = destinationAttribute;
      this.fyleFields = fyleFieldsResponse;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: 'Create a Custom Field', is_dependent: true });
      this.setupFormWatchers();
      this.initializeCustomFieldForm(false);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

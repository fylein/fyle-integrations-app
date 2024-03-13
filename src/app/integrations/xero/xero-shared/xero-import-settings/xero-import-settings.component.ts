import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ExpenseField, ImportSettingMappingRow, ImportSettingsModel } from 'src/app/core/models/common/import-settings.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { XeroWorkspaceGeneralSetting } from 'src/app/core/models/xero/db/xero-workspace-general-setting.model';
import { XeroImportSettingGet, XeroImportSettingModel } from 'src/app/core/models/xero/xero-configuration/xero-import-settings.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { XeroConnectorService } from 'src/app/core/services/xero/xero-configuration/xero-connector.service';
import { XeroImportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-import-settings.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';

@Component({
  selector: 'app-xero-import-settings',
  templateUrl: './xero-import-settings.component.html',
  styleUrls: ['./xero-import-settings.component.scss']
})
export class XeroImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  appName: string = AppName.XERO;

  isOnboarding: boolean;

  importSettings: XeroImportSettingGet;

  fyleExpenseFields: FyleField[];

  workspaceGeneralSettings: XeroWorkspaceGeneralSetting;

  xeroExpenseFields: IntegrationField[];

  isProjectMapped: boolean;

  taxCodes: DestinationAttribute[];

  importSettingsForm: FormGroup;

  customFieldType: string;

  customFieldControl: AbstractControl;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  showCustomFieldDialog: boolean;

  isPreviewDialogVisible: boolean;

  customField: ExpenseField;

  customFieldOption: ExpenseField[] = ImportSettingsModel.getCustomFieldOption();

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  chartOfAccountTypesList: string[] = XeroImportSettingModel.getChartOfAccountTypesList();

  isTaxGroupSyncAllowed: boolean;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.xero.configuration.importSetting;

  readonly supportArticleLink = brandingKbArticles.onboardingArticles.XERO.EXPORT_SETTING;

  readonly brandingConfig = brandingConfig;

  constructor(
    private importSettingService: XeroImportSettingsService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private mappingService: MappingService,
    private xeroHelperService: XeroHelperService,
    private formBuilder: FormBuilder,
    private xeroConnectorService: XeroConnectorService
  ) { }

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

  refreshDimensions() {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbo/onboarding/export_settings`]);
  }

  saveFyleExpenseField(): void {
    this.customField = {
      attribute_type: this.customFieldForm.value.attribute_type.split(' ').join('_').toUpperCase(),
      display_name: this.customFieldForm.value.attribute_type,
      source_placeholder: this.customFieldForm.value.source_placeholder,
      is_dependent: false
    };

    if (this.customFieldControl) {
      this.fyleExpenseFields.pop();
      this.fyleExpenseFields.push(this.customField);
      this.fyleExpenseFields.push(this.customFieldOption[0]);
      const expenseField = {
        source_field: this.customField.attribute_type,
        destination_field: this.customFieldControl.value.destination_field,
        import_to_fyle: true,
        is_custom: true,
        source_placeholder: this.customField.source_placeholder
      };
      (this.importSettingsForm.get('expenseFields') as FormArray).controls.filter(field => field.value.destination_field === this.customFieldControl.value.destination_field)[0].patchValue(expenseField);
      ((this.importSettingsForm.get('expenseFields') as FormArray).controls.filter(field => field.value.destination_field === this.customFieldControl.value.destination_field)[0] as FormGroup).controls.import_to_fyle.disable();
      this.customFieldForm.reset();
      this.showCustomFieldDialog = false;
    }
  }

  private initializeCustomFieldForm(shouldShowDialog: boolean) {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = shouldShowDialog;
  }

  private createTaxCodeWatcher(): void {
    this.importSettingsForm.controls.taxCode.valueChanges.subscribe((isTaxCodeEnabled) => {
      if (isTaxCodeEnabled) {
        this.importSettingsForm.controls.defaultTaxCode.setValidators(Validators.required);
      } else {
        this.importSettingsForm.controls.defaultTaxCode.clearValidators();
        this.importSettingsForm.controls.defaultTaxCode.setValue(null);
      }
    });
  }

  private createCOAWatcher(): void {
    this.importSettingsForm.controls.importCategories.valueChanges.subscribe((isImportCategoriesEnabled) => {
      if (!isImportCategoriesEnabled) {
        this.importSettingsForm.controls.chartOfAccountTypes.setValue(['Expense']);
      }
    });
  }

  private setupFormWatchers(): void {
    this.createTaxCodeWatcher();
    this.createCOAWatcher();
    const expenseFieldArray = this.importSettingsForm.get('expenseFields') as FormArray;
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

  save(): void {
    // ToDo
  }

  setupPage() {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleFields('v1'),
      this.importSettingService.getXeroField(),
      this.mappingService.getDestinationAttributes('TAX_CODE', 'v1', 'xero'),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.xeroConnectorService.getXeroCredentials(this.workspaceService.getWorkspaceId())
    ]).subscribe(response => {
      this.importSettings = response[0];
      this.fyleExpenseFields = response[1];
      this.xeroExpenseFields = response[2];
      this.taxCodes = response[3];
      this.workspaceGeneralSettings = response[4];

      this.importSettingsForm = XeroImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, this.xeroExpenseFields);

      if (response[5] && response[5].country !== 'US') {
        this.isTaxGroupSyncAllowed = true;
      }

      this.fyleExpenseFields.push({ attribute_type: 'custom_field', display_name: 'Create a Custom Field', is_dependent: true });
      this.setupFormWatchers();
      this.initializeCustomFieldForm(false);

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

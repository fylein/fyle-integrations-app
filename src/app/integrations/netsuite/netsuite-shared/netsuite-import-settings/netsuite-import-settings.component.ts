import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import type { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import type { ExpenseField } from 'src/app/core/models/common/import-settings.model';
import { ImportSettingsModel } from 'src/app/core/models/common/import-settings.model';
import type { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import type { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import type { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, EmployeeFieldMapping, NetSuiteCorporateCreditCardExpensesObject, NetsuiteFyleField, NetsuiteOnboardingState, NetsuiteReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import type { NetsuiteImportSettingGet } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-import-setting.model';
import { NetsuiteImportSettingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-import-setting.model';
import type { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import type { MappingService } from 'src/app/core/services/common/mapping.service';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import type { NetsuiteAdvancedSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-advanced-settings.service';
import type { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';
import type { NetsuiteImportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-import-settings.service';
import type { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import type { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';

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

  isExpenseCategoryEnabled: boolean;

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

  importSettings: NetsuiteImportSettingGet | null;

  customrSegmentOptions: SelectFormOption[] = NetsuiteImportSettingModel.getCustomSegmentOptions();

  isImportItemsAllowed: boolean;

  isImportProjectsAllowed: boolean;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  customSegmentForm: FormGroup = this.formBuilder.group({
    scriptId: ['', Validators.required],
    internalId: ['', Validators.required],
    customFieldType: ['', Validators.required]
  });

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.netsuite.configuration.importSetting;

  isCustomSegmentTrigged: boolean = false;

  isCustomSegmentSaveInProgress: boolean = false;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private helperService: NetsuiteHelperService,
    private importSettingService: NetsuiteImportSettingsService,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private netsuiteExportSettingService: NetsuiteExportSettingsService,
    private netsuiteConnectorService: NetsuiteConnectorService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private netsuiteAdvancedSettingService: NetsuiteAdvancedSettingsService
  ) { }

  addCustomSegment() {
    this.isCustomSegmentTrigged = true;
  }

  closeCustomSegment() {
    this.isCustomSegmentTrigged = false;
    this.customSegmentForm.reset();
  }

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
        destination_field: this.customFieldControl.get('destination_field')?.value,
        import_to_fyle: true,
        is_custom: true,
        source_placeholder: this.customField.source_placeholder
      };
      (this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0].patchValue(expenseField);
      ((this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0] as FormGroup).controls.import_to_fyle.disable();
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
            destination_field: control.get('destination_field')?.value,
            import_to_fyle: control.get('import_to_fyle')?.value,
            is_custom: control.get('is_custom')?.value,
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

  saveCustomSegment() {
    this.isCustomSegmentSaveInProgress = true;
    const customSegmentPayload = NetsuiteImportSettingModel.constructCustomSegmentPayload(this.customSegmentForm, +this.workspaceService.getWorkspaceId());

    this.importSettingService.postNetsuiteCustomSegments(customSegmentPayload).subscribe(() => {
      this.importSettingService.getNetsuiteFields().subscribe((netsuiteFields: IntegrationField[]) => {
        this.isCustomSegmentTrigged = false;
        this.isCustomSegmentSaveInProgress = false;
        if (this.isImportProjectsAllowed) {
          this.netsuiteFields = netsuiteFields;
        } else {
          this.netsuiteFields = netsuiteFields.filter((filed) => filed.attribute_type !== NetsuiteFyleField.PROJECT);
        }
        this.importSettingForm = NetsuiteImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, this.netsuiteFields, this.taxCodes);
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Custom field added successfully');
        this.customSegmentForm.reset();
      });
    }, () => {
      this.isCustomSegmentTrigged = false;
      this.isCustomSegmentSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Failed to add custom field');
      this.customSegmentForm.reset();
    });
  }

  getCategoryLabel(): string {
    if (this.isExpenseCategoryEnabled) {
      return brandingConfig.brandId !== 'co' ? 'Import the Expense Categories' : 'Import expense categories';
    }
    return  brandingConfig.brandId !== 'co' ? 'Import the Accounts' : 'Import accounts';
  }

  getCategorySubLabel(): string {
    if (this.isExpenseCategoryEnabled) {
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
      this.workspaceService.getConfiguration(),
      this.mappingService.getPaginatedDestinationAttributes(NetsuiteFyleField.TAX_ITEM)
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, subsidiaryMapping, netsuiteFields, workspaceGeneralSetting, destinationAttribute]) => {
      this.importSettings = importSettingsResponse;
      if (subsidiaryMapping && subsidiaryMapping.country_name !== '_unitedStates') {
        this.isTaxGroupSyncAllowed = true;
      }

      if (workspaceGeneralSetting.employee_field_mapping === EmployeeFieldMapping .EMPLOYEE){
        this.isImportEmployeeAllowed = true;
      }

      this.isExpenseCategoryEnabled = (
        workspaceGeneralSetting.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT ||
        workspaceGeneralSetting.corporate_credit_card_expenses_object === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT
      );

      if (workspaceGeneralSetting.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.BILL && (!workspaceGeneralSetting.corporate_credit_card_expenses_object || workspaceGeneralSetting.corporate_credit_card_expenses_object === 'BILL')) {
        this.isImportItemsAllowed = true;
      }

      if (
        ( workspaceGeneralSetting.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY && workspaceGeneralSetting.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY )
        ||
        ( !workspaceGeneralSetting.reimbursable_expenses_object && workspaceGeneralSetting.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY )
        ||
        ( workspaceGeneralSetting.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY && !workspaceGeneralSetting.corporate_credit_card_expenses_object )
      ) {
        this.isImportProjectsAllowed = false;
        this.netsuiteFields = netsuiteFields.filter((filed) => filed.attribute_type !== NetsuiteFyleField.PROJECT);
      } else {
        this.isImportProjectsAllowed = true;
        this.netsuiteFields = netsuiteFields;
      }

      if (!workspaceGeneralSetting.auto_create_merchants) {
        this.isImportMerchantsAllowed = true;
      }

      this.taxCodes = destinationAttribute.results;
      this.importSettingForm = NetsuiteImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, this.netsuiteFields, this.taxCodes);
      this.fyleFields = fyleFieldsResponse;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: 'Create a Custom Field', is_dependent: false });
      this.setupFormWatchers();
      this.initializeCustomFieldForm(false);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

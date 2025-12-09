import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  brandingConfig,
  brandingFeatureConfig,
  brandingKbArticles,
  brandingStyle,
} from 'src/app/branding/branding-config';
import { ExpenseField } from 'src/app/core/models/common/import-settings.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, ToastSeverity, XeroOnboardingState } from 'src/app/core/models/enum/enum.model';
import { XeroFyleField } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { XeroWorkspaceGeneralSetting } from 'src/app/core/models/xero/db/xero-workspace-general-setting.model';
import { XeroImportSettingGet } from 'src/app/core/models/xero/xero-configuration/xero-import-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { XeroConnectorService } from 'src/app/core/services/xero/xero-configuration/xero-connector.service';
import { XeroImportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-import-settings.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';
import { TranslocoService } from '@jsverse/transloco';
import { ImportSettingsService } from 'src/app/core/services/common/import-settings.service';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
  selector: 'app-xero-import-settings',
  templateUrl: './xero-import-settings.component.html',
  styleUrls: ['./xero-import-settings.component.scss'],
  standalone: false,
})
export class XeroImportSettingsComponent implements OnInit {
  isLoading: boolean = true;

  appName: string = AppName.XERO;

  isOnboarding: boolean;

  importSettings: XeroImportSettingGet;

  fyleExpenseFields: FyleField[];

  workspaceGeneralSettings: XeroWorkspaceGeneralSetting;

  xeroExpenseFields: IntegrationField[];

  taxCodes: DestinationAttribute[];

  importSettingsForm: FormGroup;

  customFieldType: string;

  customFieldControl: AbstractControl;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required],
  });

  showCustomFieldDialog: boolean;

  isPreviewDialogVisible: boolean;

  customField: ExpenseField;

  customFieldOption: ExpenseField[];

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  chartOfAccountTypesList: string[] = XeroImportSettingsService.getChartOfAccountTypesList();

  isTaxGroupSyncAllowed: boolean;

  isProjectMapped: boolean;

  isCustomerPresent: boolean;

  org: Org = this.orgService.getCachedOrg();

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly supportArticleLink = brandingKbArticles.onboardingArticles.XERO.IMPORT_SETTING;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private importSettingService: XeroImportSettingsService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private mappingService: MappingService,
    private xeroHelperService: XeroHelperService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private xeroConnectorService: XeroConnectorService,
    private translocoService: TranslocoService,
    public brandingService: BrandingService,
  ) {
    this.customFieldOption = this.importSettingService.getCustomFieldOption();
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

  refreshDimensions() {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/xero/onboarding/export_settings`]);
  }

  saveFyleExpenseField(): void {
    this.customField = {
      attribute_type: this.customFieldForm.get('attribute_type')?.value.split(' ').join('_').toUpperCase(),
      display_name: this.customFieldForm.get('attribute_type')?.value,
      source_placeholder: this.customFieldForm.get('source_placeholder')?.value,
      is_dependent: false,
    };

    if (this.customFieldControl) {
      this.fyleExpenseFields.pop();
      this.fyleExpenseFields.push(this.customField);
      this.fyleExpenseFields.push(this.customFieldOption[0]);
      const expenseField = {
        source_field: this.customField.attribute_type,
        destination_field: this.customFieldControl.get('destination_field')?.value,
        import_to_fyle: true,
        is_custom: true,
        source_placeholder: this.customField.source_placeholder,
      };
      (this.importSettingsForm.get('expenseFields') as FormArray).controls
        .filter(
          (field) => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value,
        )[0]
        .patchValue(expenseField);
      (
        (this.importSettingsForm.get('expenseFields') as FormArray).controls.filter(
          (field) => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value,
        )[0] as FormGroup
      ).controls.import_to_fyle.disable();
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
        this.importSettingsForm.controls.chartOfAccountTypes.setValue(['EXPENSE']);
      }
    });
  }

  private setupFormWatchers(): void {
    this.createTaxCodeWatcher();
    this.createImportCustomerWatcher();
    this.createCOAWatcher();
    const expenseFieldArray = this.importSettingsForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control: any) => {
      control.valueChanges.subscribe((value: { source_field: string; destination_field: string }) => {
        if (value.source_field === 'custom_field') {
          this.initializeCustomFieldForm(true);
          this.customFieldType = '';
          this.customFieldControl = control;
          this.customFieldControl.patchValue({
            source_field: '',
            destination_field: control.get('destination_field')?.value,
            import_to_fyle: control.get('import_to_fyle')?.value,
            is_custom: control.get('is_custom')?.value,
            source_placeholder: null,
          });
        }
      });
    });
  }

  private constructPayloadAndSave() {
    this.isSaveInProgress = true;
    const importSettingPayload = this.importSettingService.constructPayload(this.importSettingsForm);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe(
      () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(
          ToastSeverity.SUCCESS,
          this.translocoService.translate('xeroImportSettings.importSettingsSuccess'),
          undefined,
          this.isOnboarding,
        );

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(XeroOnboardingState.ADVANCED_CONFIGURATION);
          this.router.navigate([`/integrations/xero/onboarding/advanced_settings`]);
        }
      },
      () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(
          ToastSeverity.ERROR,
          this.translocoService.translate('xeroImportSettings.importSettingsError'),
        );
      },
    );
  }

  save(): void {
    if (this.importSettingsForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private createImportCustomerWatcher(): void {
    if (brandingFeatureConfig.featureFlags.importSettings.disableCustomerSourceField) {
      const formArray = this.importSettingsForm.get('expenseFields') as FormArray;
      const index = formArray.value.findIndex((data: any) => data.destination_field === XeroFyleField.CUSTOMER);
      formArray.controls[index]?.get('import_to_fyle')?.valueChanges.subscribe((isCustomerImportEnabled) => {
        if (isCustomerImportEnabled) {
          formArray.controls[index]?.get('source_field')?.patchValue(XeroFyleField.PROJECT);
          this.importSettingsForm.controls.importCustomers.patchValue(true);
          this.fyleExpenseFields = this.fyleExpenseFields.filter(
            (field) => field.attribute_type !== XeroFyleField.PROJECT,
          );
        } else {
          formArray.controls[index]?.get('source_field')?.patchValue('DISABLED_XERO_SOURCE_FIELD');
          this.importSettingsForm.controls.importCustomers.patchValue(false);
          const fyleField = this.fyleExpenseFields.filter((field) => field.attribute_type === XeroFyleField.PROJECT);
          if (fyleField.length === 0) {
            this.fyleExpenseFields.pop();
            this.fyleExpenseFields.push({
              attribute_type: XeroFyleField.PROJECT,
              display_name: this.translocoService.translate('xeroImportSettings.project'),
              is_dependent: false,
            });
            this.fyleExpenseFields.push(this.customFieldOption[0]);
          }
        }
      });
    } else {
      this.importSettingsForm.controls.importCustomers.valueChanges.subscribe((isCustomerImportEnabled) => {
        if (isCustomerImportEnabled) {
          this.fyleExpenseFields = this.fyleExpenseFields.filter(
            (field) => field.attribute_type !== XeroFyleField.PROJECT,
          );
        } else {
          const fyleField = this.fyleExpenseFields.filter((field) => field.attribute_type === XeroFyleField.PROJECT);
          if (fyleField.length === 0) {
            this.fyleExpenseFields.pop();
            this.fyleExpenseFields.push({
              attribute_type: XeroFyleField.PROJECT,
              display_name: this.translocoService.translate('xeroImportSettings.project'),
              is_dependent: false,
            });
            this.fyleExpenseFields.push(this.customFieldOption[0]);
          }
        }
      });
    }
  }

  setupPage() {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleFields('v1'),
      this.importSettingService.getXeroField(),
      this.mappingService.getDestinationAttributes(XeroFyleField.TAX_CODE, 'v1', 'xero'),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.xeroConnectorService.getXeroCredentials(this.workspaceService.getWorkspaceId()),
    ]).subscribe((response) => {
      this.importSettings = response[0];
      this.fyleExpenseFields = response[1];
      this.xeroExpenseFields = response[2];
      this.taxCodes = response[3];
      this.workspaceGeneralSettings = response[4];

      this.isCustomerPresent =
        this.xeroExpenseFields.findIndex((data: IntegrationField) => data.attribute_type === XeroFyleField.CUSTOMER) !==
        -1
          ? true
          : false;

      this.xeroExpenseFields = this.xeroExpenseFields.filter((data) => data.attribute_type !== XeroFyleField.CUSTOMER);

      this.importSettingsForm = this.importSettingService.mapAPIResponseToFormGroup(
        this.importSettings,
        this.xeroExpenseFields,
        this.isCustomerPresent,
        this.taxCodes,
      );

      if (response[5] && response[5].country !== 'US' && new Date(this.org.created_at) < new Date('2024-08-19')) {
        this.isTaxGroupSyncAllowed = true;
      }
      // This is only for C1
      if (brandingFeatureConfig.featureFlags.importSettings.disableCustomerSourceField) {
        this.xeroExpenseFields = response[2];
      }

      this.isProjectMapped =
        this.importSettings.mapping_settings.findIndex(
          (data) => data.source_field === XeroFyleField.PROJECT && data.destination_field !== XeroFyleField.CUSTOMER,
        ) !== -1
          ? true
          : false;

      this.fyleExpenseFields.push({
        attribute_type: 'custom_field',
        display_name: this.translocoService.translate('xeroImportSettings.createCustomField'),
        is_dependent: false,
      });
      this.setupFormWatchers();
      this.initializeCustomFieldForm(false);

      this.isLoading = false;
    });
  }

  updateCustomerImportAvailability(isMapped: boolean) {
    this.isProjectMapped = isMapped;
  }

  ngOnInit(): void {
    this.setupPage();
  }
}

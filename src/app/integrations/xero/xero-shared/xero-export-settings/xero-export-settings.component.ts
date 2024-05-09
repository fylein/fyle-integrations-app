import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ToastSeverity, XeroCorporateCreditCardExpensesObject, XeroOnboardingState, XeroReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { XeroExportSettingGet, XeroExportSettingModel } from 'src/app/core/models/xero/xero-configuration/xero-export-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { XeroExportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-export-settings.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';

@Component({
  selector: 'app-xero-export-settings',
  templateUrl: './xero-export-settings.component.html',
  styleUrls: ['./xero-export-settings.component.scss']
})
export class XeroExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.XERO.EXPORT_SETTING;

  brandingConfig = brandingConfig;

  isOnboarding: boolean;

  windowReference: Window;

  exportSettings:  XeroExportSettingGet;

  bankAccounts: DestinationAttribute[];

  reimbursableExportTypes: SelectFormOption[] = XeroExportSettingModel.getReimbursableExportTypes();

  creditCardExportTypes =  XeroExportSettingModel.getCreditCardExportTypes();

  reimbursableExpenseGroupByOptions =  XeroExportSettingModel.getReimbursableExpenseGroupingOptions();

  cccExpenseGroupByOptions =  XeroExportSettingModel.getCCCExpenseGroupingOptions();

  reimbursableExpenseGroupingDateOptions =  XeroExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions = XeroExportSettingModel.getCCCExpenseGroupingDateOptions();

  autoMapEmployeeTypes = XeroExportSettingModel.getAutoMapEmployeeOptions();

  expenseStateOptions = XeroExportSettingModel.getReimbursableExpenseStateOptions();

  cccExpenseStateOptions = XeroExportSettingModel.getCCCExpenseStateOptions();

  exportSettingForm: FormGroup;

  isSaveInProgress: boolean;

  isConfirmationDialogVisible: boolean;

  warningDialogText: string;

  appName: AppName = AppName.XERO;

  EmployeeFieldMapping = EmployeeFieldMapping;

  ConfigurationCtaText = ConfigurationCta;

  previewImagePaths =[
    {},
    {
      'BANK TRANSACTION': 'assets/illustrations/xero/bank-transaction.png'
    }
  ];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.xero.configuration.exportSetting;

  constructor(
    public helperService: HelperService,
    private exportSettingService: XeroExportSettingsService,
    private mappingService: MappingService,
    private xeroHelperService: XeroHelperService,
    private router : Router,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService
  ) { }

  refreshDimensions(isRefresh: boolean) {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
  }

  navigateToPreviousStep() {
    this.router.navigate([`/integrations/xero/onboarding/connector`]);
  }

  save() {
    if (this.exportSettingForm.valid) {
      this.constructPayloadAndSave({
        hasAccepted: true,
        event: ConfigurationWarningEvent.XERO_EXPORT_SETTINGS
      });
    }
  }

  constructPayloadAndSave(event: ConfigurationWarningOut) {
    if (event.hasAccepted) {
      this.isSaveInProgress = true;
      const exportSettingPayload = XeroExportSettingModel.constructPayload(this.exportSettingForm);
      this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: XeroExportSettingGet) => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(XeroOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/xero/onboarding/import_settings`]);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
    }
  }

  setupPage() {
    this.isOnboarding = this.router.url.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT'];

    forkJoin([
      this.exportSettingService.getExportSettings(),
      this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v1', 'xero')
    ]).subscribe(response => {
      this.exportSettings = response[0];
      this.bankAccounts = response[1].BANK_ACCOUNT;
      this.exportSettingForm = XeroExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, this.bankAccounts);
      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }
      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      const [exportSettingValidatorRule, exportModuleRule] = XeroExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      this.helperService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      this.isLoading = false;

    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

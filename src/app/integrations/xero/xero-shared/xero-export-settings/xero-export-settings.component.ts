import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, filter, forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ExportSettingModel, ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, XeroExportSettingDestinationOptionKey, ToastSeverity, XeroOnboardingState, XeroCorporateCreditCardExpensesObject } from 'src/app/core/models/enum/enum.model';
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

  splitExpenseGroupingOptions = XeroExportSettingModel.getSplitExpenseGroupingOptions();

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

  isOptionSearchInProgress: boolean;

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  XeroExportSettingDestinationOptionKey = XeroExportSettingDestinationOptionKey;

  previewImagePaths =[
    {},
    {
      'BANK TRANSACTION': 'assets/illustrations/xero/bank-transaction.png'
    }
  ];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.xero.configuration.exportSetting;

  readonly XeroCorporateCreditCardExpensesObject = XeroCorporateCreditCardExpensesObject;

  readonly brandingStyle = brandingStyle;

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

  private setupCustomWatchers(): void {
    // Removing not relevant date options
    this.reimbursableExpenseGroupingDateOptions = ExportSettingModel.constructExportDateOptions(false, this.exportSettingForm.controls.eimbursableExportGroup.value, this.exportSettingForm.controls.reimbursableExportDate.value);
    this.cccExpenseGroupingDateOptions = ExportSettingModel.constructExportDateOptions(true, this.exportSettingForm.controls.creditCardExportGroup.value, this.exportSettingForm.controls.creditCardExportDate.value);
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
    this.isConfirmationDialogVisible = false;
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


  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: ExportSettingOptionSearch) => {
      const existingOptions = this.bankAccounts;

      this.mappingService.getPaginatedDestinationAttributes(event.destinationOptionKey, event.searchTerm).subscribe((response) => {

        // Insert new options to existing options
        response.results.forEach((option) => {
          if (!existingOptions.find((existingOption) => existingOption.destination_id === option.destination_id)) {
            existingOptions.push(option);
          }
        });

        this.bankAccounts = existingOptions.concat();
        this.bankAccounts.sort((a, b) => (a.value || '').localeCompare(b.value || ''));

        this.isOptionSearchInProgress = false;
      });
    });
  }

  searchOptionsDropdown(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }

  setupPage() {
    this.isOnboarding = this.router.url.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT'];

    const groupedAttributes = destinationAttributes.map(destinationAttribute =>
      this.mappingService.getPaginatedDestinationAttributes(destinationAttribute).pipe(filter(response => !!response))
    );

    forkJoin([
      this.exportSettingService.getExportSettings(),
      ...groupedAttributes
    ]).subscribe(([exportSettings, bankAccounts]) => {
      this.exportSettings = exportSettings;
      this.bankAccounts = bankAccounts.results;

      if (this.exportSettings.general_mappings) {
        this.helperService.addDestinationAttributeIfNotExists({
          options: this.bankAccounts,
          destination_id: this.exportSettings.general_mappings.bank_account.id,
          value: this.exportSettings.general_mappings.bank_account.name
        });
      }
      this.exportSettingForm = XeroExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, this.bankAccounts);
      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }
      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      const [exportSettingValidatorRule, exportModuleRule] = XeroExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      this.helperService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      this.setupCustomWatchers();

      this.optionSearchWatcher();

      this.isLoading = false;

    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, filter, forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, XeroExportSettingDestinationOptionKey, ToastSeverity, XeroOnboardingState, XeroCorporateCreditCardExpensesObject } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { XeroExportSettingGet } from 'src/app/core/models/xero/xero-configuration/xero-export-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { XeroExportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-export-settings.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';
import { TranslocoService } from '@jsverse/transloco';
import { ExportSettingsService } from 'src/app/core/services/common/export-settings.service';

@Component({
    selector: 'app-xero-export-settings',
    templateUrl: './xero-export-settings.component.html',
    styleUrls: ['./xero-export-settings.component.scss'],
    standalone: false
})
export class XeroExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.XERO.EXPORT_SETTING;

  brandingConfig = brandingConfig;

  isOnboarding: boolean;

  windowReference: Window;

  exportSettings:  XeroExportSettingGet;

  bankAccounts: DestinationAttribute[];

  reimbursableExportTypes: SelectFormOption[];

  creditCardExportTypes: SelectFormOption[];

  reimbursableExpenseGroupByOptions: SelectFormOption[];

  cccExpenseGroupByOptions: SelectFormOption[];

  reimbursableExpenseGroupingDateOptions: SelectFormOption[] = [];

  cccExpenseGroupingDateOptions: SelectFormOption[];

  splitExpenseGroupingOptions: SelectFormOption[];

  autoMapEmployeeTypes: SelectFormOption[];

  expenseStateOptions: SelectFormOption[];

  cccExpenseStateOptions: SelectFormOption[];

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

  readonly XeroCorporateCreditCardExpensesObject = XeroCorporateCreditCardExpensesObject;

  readonly brandingStyle = brandingStyle;

  constructor(
    public helperService: HelperService,
    private xeroExportSettingService: XeroExportSettingsService,
    private mappingService: MappingService,
    private xeroHelperService: XeroHelperService,
    private router : Router,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService,
    private exportSettingsService: ExportSettingsService
  ) {
    this.reimbursableExpenseGroupingDateOptions = this.xeroExportSettingService.getReimbursableExpenseGroupingDateOptions();
    this.reimbursableExportTypes = this.xeroExportSettingService.getReimbursableExportTypes();
    this.creditCardExportTypes =  this.xeroExportSettingService.getCreditCardExportTypes();
    this.reimbursableExpenseGroupByOptions =  this.xeroExportSettingService.getReimbursableExpenseGroupingOptions();
    this.cccExpenseGroupByOptions =  this.xeroExportSettingService.getCCCExpenseGroupingOptions();
    this.cccExpenseGroupingDateOptions = this.xeroExportSettingService.getCCCExpenseGroupingDateOptions();
    this.splitExpenseGroupingOptions = this.xeroExportSettingService.getSplitExpenseGroupingOptions();
    this.autoMapEmployeeTypes = this.xeroExportSettingService.getAutoMapEmployeeOptions();
    this.expenseStateOptions = this.xeroExportSettingService.getReimbursableExpenseStateOptions();
    this.cccExpenseStateOptions = this.xeroExportSettingService.getCCCExpenseStateOptions();
  }

  refreshDimensions(isRefresh: boolean) {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
  }

  navigateToPreviousStep() {
    this.router.navigate([`/integrations/xero/onboarding/connector`]);
  }

  private setupCustomWatchers(): void {
    // Removing not relevant date options
    this.reimbursableExpenseGroupingDateOptions = this.exportSettingsService.constructExportDateOptions(false, this.exportSettingForm.controls.reimbursableExportGroup.value, this.exportSettingForm.controls.reimbursableExportDate.value);
    this.cccExpenseGroupingDateOptions = this.exportSettingsService.constructExportDateOptions(true, this.exportSettingForm.controls.creditCardExportGroup.value, this.exportSettingForm.controls.creditCardExportDate.value);
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
      const exportSettingPayload = this.xeroExportSettingService.constructPayload(this.exportSettingForm);
      this.xeroExportSettingService.postExportSettings(exportSettingPayload).subscribe((response: XeroExportSettingGet) => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('xeroExportSettings.exportSettingsSuccess'));

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(XeroOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/xero/onboarding/import_settings`]);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('xeroExportSettings.exportSettingsError'));
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
      this.xeroExportSettingService.getExportSettings(),
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
      this.exportSettingForm = this.xeroExportSettingService.mapAPIResponseToFormGroup(this.exportSettings, this.bankAccounts);
      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }
      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      const [exportSettingValidatorRule, exportModuleRule] = XeroExportSettingsService.getValidators();

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

import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, catchError, debounceTime, filter, forkJoin, of } from 'rxjs';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, ExpenseGroupedBy, FyleField, Page, Sage300ExpenseDate, Sage300ExportSettingDestinationOptionKey, Sage300ExportType, Sage300Field, Sage300OnboardingState, Sage300UpdateEvent, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { ExportSettingModel, ExportModuleRule, Sage300ExportSettingFormOption, Sage300ExportSettingGet, ExportSettingValidatorRule } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { Sage300ImportSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-import-settings.service';
import { TranslocoService } from '@jsverse/transloco';
import { ExportSettingsService } from 'src/app/core/services/common/export-settings.service';


@Component({
  selector: 'app-sage300-export-settings',
  templateUrl: './sage300-export-settings.component.html',
  styleUrls: ['./sage300-export-settings.component.scss']
})
export class Sage300ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isOnboarding: boolean;

  isSaveInProgress: boolean;

  exportSettings: Sage300ExportSettingGet | null;

  exportSettingForm: FormGroup;

  redirectLink: string = brandingKbArticles.onboardingArticles.SAGE300.EXPORT_SETTING;

  appName: string = AppName.SAGE300;

  Sage300ExportType = Sage300ExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: SelectFormOption[] = this.exportSettingService.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions: SelectFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions: SelectFormOption[] = this.exportSettingService.getCCCExpenseGroupingDateOptions();

  expensesExportTypeOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpensesExportTypeOptions();

  reimbursableExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseState();

  cccExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseState();

  sessionStartTime = new Date();

  vendorOptions: DestinationAttribute[];

  creditCardAccountOptions: DestinationAttribute[];

  debitCardAccountOptions: DestinationAttribute[];

  accountsPayableOptions: DestinationAttribute[];

  sage300Jobs: DestinationAttribute[];

  isOptionSearchInProgress: boolean;

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  Sage300ExportSettingDestinationOptionKey = Sage300ExportSettingDestinationOptionKey;

  previewImagePaths =[
    {
      'PURCHASE_INVOICE': 'assets/illustrations/sage300/preview.png',
      'DIRECT_COST': 'assets/illustrations/sage300/preview.png'
    },
    {
      'PURCHASE_INVOICE': 'assets/illustrations/sage300/preview.png',
      'DIRECT_COST': 'assets/illustrations/sage300/preview.png'
    }
  ];

  previewExpenseGroupTypeImagePath = [
    {
      'EXPENSE': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg',
      'EXPENSE_REPOR': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg'
    },
    {
      'EXPENSE': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg',
      'EXPENSE_REPOR': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg'
    }
  ];

  readonly brandingConfig = brandingConfig;

  sage300ImportCodeFields: string[];

  sage300Field = Sage300Field;

  readonly brandingStyle = brandingStyle;

  constructor(
    private exportSettingService: Sage300ExportSettingService,
    private importSettingsService: Sage300ImportSettingsService,
    private router: Router,
    private helperService: HelperService,
    private sage300HelperService: Sage300HelperService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService,
    public helper: HelperService,
    private mappingService: MappingService,
    private translocoService: TranslocoService
  ) { }

  refreshDimensions(isRefresh: boolean) {
    this.sage300HelperService.importAttributes(isRefresh);
  }

  private setupCustomWatchers(): void {
    this.exportSettingForm.controls.reimbursableExportGroup?.valueChanges.subscribe((reimbursableExportGroup) => {
      this.reimbursableExpenseGroupingDateOptions = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();
      this.reimbursableExpenseGroupingDateOptions = ExportSettingsService.constructGroupingDateOptions(reimbursableExportGroup, this.reimbursableExpenseGroupingDateOptions);

      const validOptions = this.getExportDate(this.reimbursableExpenseGroupingDateOptions, 'reimbursableExportGroup');
      ExportSettingsService.clearInvalidDateOption(
        this.exportSettingForm.get('reimbursableExportDate'),
        validOptions
      );
    });

    this.exportSettingForm.controls.cccExportGroup?.valueChanges.subscribe((cccExportGroup) => {
      this.cccExpenseGroupingDateOptions = this.exportSettingService.getCCCExpenseGroupingDateOptions();
      this.cccExpenseGroupingDateOptions = ExportSettingsService.constructGroupingDateOptions(cccExportGroup, this.cccExpenseGroupingDateOptions);

      const validOptions = this.getExportDate(this.cccExpenseGroupingDateOptions, 'cccExportGroup');
      ExportSettingsService.clearInvalidDateOption(
        this.exportSettingForm.get('cccExportDate'),
        validOptions
      );
    });
  }

  private constructPayloadAndSave(): void {
    this.isSaveInProgress = true;
    const exportSettingPayload = ExportSettingModel.createExportSettingPayload(this.exportSettingForm);
    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((exportSettingResponse: Sage300ExportSettingGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('sage300ExportSettings.exportSettingsSavedSuccess'));
      this.trackingService.trackTimeSpent(TrackingApp.SAGE300, Page.EXPORT_SETTING_SAGE300, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === Sage300OnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.SAGE300, Sage300OnboardingState.EXPORT_SETTINGS, 2, exportSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.SAGE300,
          Sage300UpdateEvent.ADVANCED_SETTINGS_SAGE300,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.exportSettings,
            newState: exportSettingResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(Sage300OnboardingState.IMPORT_SETTINGS);
        this.router.navigate([`/integrations/sage300/onboarding/import_settings`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('sage300ExportSettings.errorSavingExportSettings'));
      });
  }

  save(): void {
    if (this.exportSettingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  getExportDate(options: SelectFormOption[], formControllerName: string): SelectFormOption[]{
    if (this.exportSettingForm.controls[formControllerName].value === ExpenseGroupedBy.EXPENSE) {
      return options.filter(option => option.value !== Sage300ExpenseDate.LAST_SPENT_AT);
    }
    return options.filter(option => option.value !== Sage300ExpenseDate.SPENT_AT);
  }


  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: ExportSettingOptionSearch) => {
      let existingOptions: DestinationAttribute[] = [];

      let attribuiteType: string = event.destinationOptionKey;

      switch (event.destinationOptionKey) {
        case Sage300ExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE:
          existingOptions = this.accountsPayableOptions;
          attribuiteType = Sage300Field.ACCOUNT;
          break;
        case Sage300ExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT:
          existingOptions = this.creditCardAccountOptions;
          attribuiteType = Sage300Field.ACCOUNT;
          break;
        case Sage300ExportSettingDestinationOptionKey.DEBIT_CARD_ACCOUNT:
          existingOptions = this.debitCardAccountOptions;
          attribuiteType = Sage300Field.ACCOUNT;
          break;
        case Sage300ExportSettingDestinationOptionKey.JOB:
          existingOptions = this.sage300Jobs;
          break;
        case Sage300ExportSettingDestinationOptionKey.VENDOR:
          existingOptions = this.vendorOptions;
          break;
      }

      this.mappingService.getPaginatedDestinationAttributes(attribuiteType, event.searchTerm, '', this.appName).subscribe((response) => {

        // Insert new options to existing options
        response.results.forEach((option) => {
          if (!existingOptions.find((existingOption) => existingOption.destination_id === option.destination_id)) {
            existingOptions.push(option);
          }
        });


        switch (event.destinationOptionKey) {
          case Sage300ExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE:
            this.accountsPayableOptions = existingOptions.concat();
            this.accountsPayableOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
            break;
          case Sage300ExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT:
            this.creditCardAccountOptions = existingOptions.concat();
            this.creditCardAccountOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
            break;
          case Sage300ExportSettingDestinationOptionKey.DEBIT_CARD_ACCOUNT:
            this.debitCardAccountOptions = existingOptions.concat();
            this.debitCardAccountOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
            break;
          case Sage300ExportSettingDestinationOptionKey.JOB:
            this.sage300Jobs = existingOptions.concat();
            this.sage300Jobs.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
            break;
          case Sage300ExportSettingDestinationOptionKey.VENDOR:
            this.vendorOptions = existingOptions.concat();
            this.vendorOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
            break;
        }

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

  private addMissingOptions() {

    // Reimbursable
    this.helper.addDestinationAttributeIfNotExists({
      options: this.creditCardAccountOptions,
      destination_id: this.exportSettings?.default_reimbursable_credit_card_account_id,
      value: this.exportSettings?.default_reimbursable_credit_card_account_name
    });

    this.helper.addDestinationAttributeIfNotExists({
      options: this.debitCardAccountOptions,
      destination_id: this.exportSettings?.default_debit_card_account_id,
      value: this.exportSettings?.default_debit_card_account_name
    });

    this.helper.addDestinationAttributeIfNotExists({
      options: this.sage300Jobs,
      destination_id: this.exportSettings?.default_job_id,
      value: this.exportSettings?.default_job_name
    });

    this.helper.addDestinationAttributeIfNotExists({
      options: this.accountsPayableOptions,
      destination_id: this.exportSettings?.default_reimbursable_account_payable_id,
      value: this.exportSettings?.default_reimbursable_account_payable_name
    });

    // CCC
    this.helper.addDestinationAttributeIfNotExists({
      options: this.creditCardAccountOptions,
      destination_id: this.exportSettings?.default_ccc_credit_card_account_id,
      value: this.exportSettings?.default_ccc_credit_card_account_name
    });

    // Debit card account added in call #2
    // Jobs added in call #3

    this.helper.addDestinationAttributeIfNotExists({
      options: this.accountsPayableOptions,
      destination_id: this.exportSettings?.default_ccc_account_payable_id,
      value: this.exportSettings?.default_ccc_account_payable_name
    });

    this.helper.addDestinationAttributeIfNotExists({
      options: this.vendorOptions,
      destination_id: this.exportSettings?.default_vendor_id,
      value: this.exportSettings?.default_vendor_name
    });
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    const exportSettingValidatorRule: ExportSettingValidatorRule = {
      'reimbursableExpense': ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState', 'defaultReimbursableAP'],
      'creditCardExpense': ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState', 'defaultCCCAP']
    };

    const exportModuleRule: ExportModuleRule[] = [
      {
        'formController': 'reimbursableExportType',
        'requiredValue': {
          'DIRECT_COST': ['defaultReimbursableCCCAccountName', 'defaultDebitCardAccountName', 'defaultJobName'],
          'PURCHASE_INVOICE': []
        }
      },
      {
        'formController': 'cccExportType',
        'requiredValue': {
          'DIRECT_COST': ['defaultCreditCardCCCAccountName', 'defaultDebitCardAccountName', 'defaultJobName'],
          'PURCHASE_INVOICE': ['defaultVendorName']
        }
      }
    ];

    const destinationAttributes = [FyleField.VENDOR, Sage300Field.ACCOUNT, Sage300Field.JOB];

    const groupedAttributes = destinationAttributes.map(destinationAttribute =>
      this.mappingService.getPaginatedDestinationAttributes(destinationAttribute).pipe(filter(response => !!response))
    );

    forkJoin([
      this.exportSettingService.getSage300ExportSettings().pipe(catchError(() => of(null))),
      this.importSettingsService.getSage300ImportSettings().pipe(catchError(() => of(null))),
      ...groupedAttributes
    ]).subscribe(([exportSettingsResponse, importSettingsResponse, vendors, accounts, jobs]) => {
      this.exportSettings = exportSettingsResponse;
      this.vendorOptions = vendors.results;
      this.creditCardAccountOptions = this.debitCardAccountOptions = this.accountsPayableOptions = accounts.results;
      this.sage300Jobs = jobs.results;

      if (importSettingsResponse) {
        this.sage300ImportCodeFields = importSettingsResponse.import_settings?.import_code_fields || [];
      }

      if (exportSettingsResponse) {
        this.addMissingOptions();
      }
      this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, vendors.results, accounts.results, jobs.results);

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      this.helper.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);
      this.helper.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);
      this.setupCustomWatchers();
      this.optionSearchWatcher();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

  navigateBack(): void {
    this.router.navigate([`/integrations/sage300/onboarding/connector`]);
  }

}

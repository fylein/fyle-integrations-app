import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, catchError, debounceTime, filter, forkJoin, of } from 'rxjs';
import { BusinessCentralExportSettingFormOption, BusinessCentralExportSettingGet, BusinessCentralExportSettingModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import { ExportModuleRule, ExportSettingModel, ExportSettingOptionSearch, ExportSettingValidatorRule } from 'src/app/core/models/common/export-settings.model';
import { AppName, BCExportSettingDestinationOptionKey, BusinessCentralExportType, BusinessCentralField, BusinessCentralOnboardingState, BusinessCentralUpdateEvent, ConfigurationCta, ExpenseGroupedBy, ExportDateType, FyleField, Page, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralExportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-export-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { FormGroup } from '@angular/forms';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';

@Component({
  selector: 'app-business-central-export-settings',
  templateUrl: './business-central-export-settings.component.html',
  styleUrls: ['./business-central-export-settings.component.scss']
})
export class BusinessCentralExportSettingsComponent implements OnInit {

  isOnboarding: boolean;

  exportSettings: BusinessCentralExportSettingGet | null;

  exportSettingForm: FormGroup;

  bankOptions: DestinationAttribute[];

  reimbursableBankOptions: DestinationAttribute[];

  vendorOptions: DestinationAttribute[];

  isLoading: boolean = true;

  previewImagePaths = [
    {
      'PURCHASE_INVOICE': 'assets/illustrations/ms-dynamics/purchase-invoice.png',
      'JOURNAL_ENTRY': 'assets/illustrations/ms-dynamics/journal-entry.png'
    },
    {
      'JOURNAL_ENTRY': 'assets/illustrations/ms-dynamics/journal-entry.png'
    }
  ];

  readonly brandingConfig = brandingConfig;

  redirectLink: string = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.EXPORT_SETTING;

  appName: string = AppName.BUSINESS_CENTRAL;

  BusinessCentralExportType = BusinessCentralExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: SelectFormOption[] = BusinessCentralExportSettingModel.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions: SelectFormOption[] = BusinessCentralExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions: SelectFormOption[] = BusinessCentralExportSettingModel.getCCCExpenseGroupingDateOptions();

  reimbursableExpensesExportTypeOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getReimbursableExpensesExportTypeOptions();

  cccExpensesExportTypeOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getCCCExpensesExportTypeOptions();

  reimbursableExpenseState: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getReimbursableExpenseState();

  cccExpenseState: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getCCCExpenseState();

  employeeFieldMappingOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getEntityOptions();

  employeeMapOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getEmployeeMappingOptions();

  nameReferenceInCCC: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getNameInJEOptions();

  sessionStartTime = new Date();

  isSaveInProgress: boolean;

  isOptionSearchInProgress: boolean;

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  BCExportSettingDestinationOptionKey = BCExportSettingDestinationOptionKey;

  constructor(
    private exportSettingService: BusinessCentralExportSettingsService,
    private router: Router,
    private mappingService: MappingService,
    private helperService: HelperService,
    private businessCentralHelperService: BusinessCentralHelperService,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    public helper: HelperService
  ) { }

  private constructPayloadAndSave(): void {
    this.isSaveInProgress = true;
    const exportSettingPayload = BusinessCentralExportSettingModel.createExportSettingPayload(this.exportSettingForm);
    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((exportSettingResponse: BusinessCentralExportSettingGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.BUSINESS_CENTRAL, Page.EXPORT_SETTING_BUSINESS_CENTRAL, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === BusinessCentralOnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.BUSINESS_CENTRAL, BusinessCentralOnboardingState.EXPORT_SETTINGS, 2, exportSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.BUSINESS_CENTRAL,
          BusinessCentralUpdateEvent.ADVANCED_SETTINGS_BUSINESS_CENTRAL,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.exportSettings,
            newState: exportSettingResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(BusinessCentralOnboardingState.IMPORT_SETTINGS);
        this.router.navigate([`/integrations/business_central/onboarding/import_settings`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
  }

  save(): void {
    if (this.exportSettingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  getExportDate(options: SelectFormOption[], formControllerName: string): SelectFormOption[]{
    if (this.exportSettingForm.controls[formControllerName].value === ExpenseGroupedBy.EXPENSE) {
      return options.filter(option => option.value !== ExportDateType.LAST_SPENT_AT);
    }
    return options.filter(option => option.value !== ExportDateType.SPENT_AT);
  }

  refreshDimensions(isRefresh: boolean): void{
    this.businessCentralHelperService.importAttributes(isRefresh);
  }

  private setupCustomWatchers(): void {
    this.exportSettingForm.controls.reimbursableExportGroup.valueChanges.subscribe((reimbursableExportGroup) => {
      if (brandingConfig.brandId==='fyle') {
        this.reimbursableExpenseGroupingDateOptions = BusinessCentralExportSettingModel.getReimbursableExpenseGroupingDateOptions();
        this.reimbursableExpenseGroupingDateOptions = ExportSettingModel.constructGroupingDateOptions(reimbursableExportGroup, this.reimbursableExpenseGroupingDateOptions);
      }
    });

    this.exportSettingForm.controls.cccExportGroup.valueChanges.subscribe((cccExportGroup) => {
      if (brandingConfig.brandId==='fyle') {
        this.cccExpenseGroupingDateOptions = BusinessCentralExportSettingModel.getCCCExpenseGroupingDateOptions();
        this.cccExpenseGroupingDateOptions = ExportSettingModel.constructGroupingDateOptions(cccExportGroup, this.cccExpenseGroupingDateOptions);
      }
    });
  }

  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: ExportSettingOptionSearch) => {

      if (event.destinationOptionKey === BCExportSettingDestinationOptionKey.REIMBURSABLE_BANK_ACCOUNT) {
        const observables = [
          this.mappingService.getPaginatedDestinationAttributes('BANK_ACCOUNT', event.searchTerm),
          this.mappingService.getPaginatedDestinationAttributes(
            'ACCOUNT', event.searchTerm, undefined, undefined, undefined, ['Assets', 'Liabilities']
          )
        ];

        forkJoin(observables).subscribe(([bankAccounts, accounts]) => {
          // Insert new options (if any) to existing options, and sort them
          const newOptions = [...bankAccounts.results, ...accounts.results];
          newOptions.forEach((newOption) => {
            if (!this.reimbursableBankOptions.find((existingOption) => existingOption.destination_id === newOption.destination_id)) {
              this.reimbursableBankOptions.push(newOption);
            }
          });

          this.reimbursableBankOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
          this.isOptionSearchInProgress = false;
        });

      } else {

        let existingOptions: DestinationAttribute[];
        switch (event.destinationOptionKey) {
          case BCExportSettingDestinationOptionKey.ACCOUNT:
            existingOptions = this.bankOptions;
            break;
          case BCExportSettingDestinationOptionKey.VENDOR:
            existingOptions = this.vendorOptions;
            break;
        }

        this.mappingService.getPaginatedDestinationAttributes(event.destinationOptionKey, event.searchTerm).subscribe((response) => {

          // Insert new options to existing options
          response.results.forEach((option) => {
            if (!existingOptions.find((existingOption) => existingOption.destination_id === option.destination_id)) {
              existingOptions.push(option);
            }
          });


          switch (event.destinationOptionKey) {
            case BCExportSettingDestinationOptionKey.ACCOUNT:
              this.bankOptions = existingOptions.concat();
              this.bankOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
              break;
            case BCExportSettingDestinationOptionKey.VENDOR:
              this.vendorOptions = existingOptions.concat();
              this.vendorOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
              break;
          }

          this.isOptionSearchInProgress = false;
        });
      }
    });
  }

  searchOptionsDropdown(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    const exportSettingValidatorRule: ExportSettingValidatorRule = {
      'reimbursableExpense': ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState'],
      'creditCardExpense': ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState']
    };

    const exportModuleRule: ExportModuleRule[] = [
      {
        'formController': 'reimbursableExportType',
        'requiredValue': {
          'JOURNAL_ENTRY': ['defaultBankName']
        }
      },
      {
        'formController': 'cccExportType',
        'requiredValue': {
          'JOURNAL_ENTRY': ['defaultBankName', 'journalEntryNamePreference']
        }
      }
    ];
    const commonFormFields: string[] = ['defaultBankName'];

    const destinationAttributes = [BusinessCentralField.ACCOUNT, FyleField.VENDOR];

    const groupedAttributes = destinationAttributes.map(destinationAttribute =>
      this.mappingService.getPaginatedDestinationAttributes(destinationAttribute).pipe(filter(response => !!response))
    );

    // For reimbursable default bank account options
    const reimbursableBankAccountAttributes = [
      this.mappingService.getPaginatedDestinationAttributes('BANK_ACCOUNT'),
      this.mappingService.getPaginatedDestinationAttributes(
        'ACCOUNT', undefined, undefined, undefined, undefined, ['Assets', 'Liabilities']
      )
    ];

    forkJoin([
      this.exportSettingService.getExportSettings().pipe(catchError(() => of(null))),
      ...groupedAttributes,
      ...reimbursableBankAccountAttributes
    ]).subscribe(([exportSettingsResponse, accounts, vendors, reimbursableBankAccounts, reimbursableAccounts]) => {
      this.exportSettings = exportSettingsResponse;

      if (exportSettingsResponse) {
        this.helperService.addDestinationAttributeIfNotExists({
          options: accounts.results,
          value: exportSettingsResponse?.default_bank_account_name,
          destination_id: exportSettingsResponse?.default_bank_account_id
        });

        this.helperService.addDestinationAttributeIfNotExists({
          options: vendors.results,
          value: exportSettingsResponse?.default_vendor_name,
          destination_id: exportSettingsResponse?.default_vendor_id
        });
      }

      this.exportSettingForm = BusinessCentralExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, accounts.results, vendors.results);
      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      this.helper.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);
      this.helper.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm, commonFormFields);
      this.bankOptions = accounts.results;
      this.vendorOptions = vendors.results;
      this.reimbursableBankOptions = [...reimbursableBankAccounts.results, ...reimbursableAccounts.results];
      this.reimbursableBankOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));

      this.setupCustomWatchers();
      this.optionSearchWatcher();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

  navigateBack(): void {
    this.router.navigate([`/integrations/business_central/onboarding/connector`]);
  }

}

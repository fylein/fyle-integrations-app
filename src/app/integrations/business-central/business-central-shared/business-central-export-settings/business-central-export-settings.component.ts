import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, catchError, debounceTime, filter, forkJoin, of } from 'rxjs';
import {
  BusinessCentralExportSettingFormOption,
  BusinessCentralExportSettingGet,
} from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import {
  ExportModuleRule,
  ExportSettingOptionSearch,
  ExportSettingValidatorRule,
} from 'src/app/core/models/common/export-settings.model';
import {
  AppName,
  BCExportSettingDestinationOptionKey,
  BusinessCentralExportType,
  BusinessCentralField,
  BusinessCentralOnboardingState,
  BusinessCentralUpdateEvent,
  ConfigurationCta,
  ExpenseGroupedBy,
  ExportDateType,
  FyleField,
  Page,
  ToastSeverity,
  TrackingApp,
} from 'src/app/core/models/enum/enum.model';
import { BusinessCentralExportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-export-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { FormGroup } from '@angular/forms';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { TranslocoService } from '@jsverse/transloco';
import { ExportSettingsService } from 'src/app/core/services/common/export-settings.service';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
  selector: 'app-business-central-export-settings',
  templateUrl: './business-central-export-settings.component.html',
  styleUrls: ['./business-central-export-settings.component.scss'],
  standalone: false,
})
export class BusinessCentralExportSettingsComponent implements OnInit {
  isOnboarding: boolean;

  exportSettings: BusinessCentralExportSettingGet | null;

  exportSettingForm: FormGroup;

  bankAccountOptions: DestinationAttribute[];

  vendorOptions: DestinationAttribute[];

  isLoading: boolean = true;

  previewImagePaths = [
    {
      PURCHASE_INVOICE: 'assets/illustrations/ms-dynamics/purchase-invoice.png',
      JOURNAL_ENTRY: 'assets/illustrations/ms-dynamics/journal-entry.png',
    },
    {
      JOURNAL_ENTRY: 'assets/illustrations/ms-dynamics/journal-entry.png',
    },
  ];

  readonly brandingConfig = brandingConfig;

  redirectLink: string = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.EXPORT_SETTING;

  appName: string = AppName.BUSINESS_CENTRAL;

  BusinessCentralExportType = BusinessCentralExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: SelectFormOption[] = [];

  reimbursableExpenseGroupingDateOptions: SelectFormOption[] = [];

  cccExpenseGroupingDateOptions: SelectFormOption[] = [];

  reimbursableExpensesExportTypeOptions: BusinessCentralExportSettingFormOption[] = [];

  cccExpensesExportTypeOptions: BusinessCentralExportSettingFormOption[] = [];

  reimbursableExpenseState: BusinessCentralExportSettingFormOption[] = [];

  cccExpenseState: BusinessCentralExportSettingFormOption[] = [];

  employeeFieldMappingOptions: BusinessCentralExportSettingFormOption[] = [];

  employeeMapOptions: BusinessCentralExportSettingFormOption[] = [];

  nameReferenceInCCC: BusinessCentralExportSettingFormOption[] = [];

  sessionStartTime = new Date();

  isSaveInProgress: boolean;

  isOptionSearchInProgress: boolean;

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  BCExportSettingDestinationOptionKey = BCExportSettingDestinationOptionKey;

  readonly brandingStyle = brandingStyle;

  constructor(
    private exportSettingService: BusinessCentralExportSettingsService,
    private router: Router,
    private mappingService: MappingService,
    private helperService: HelperService,
    private businessCentralHelperService: BusinessCentralHelperService,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    public helper: HelperService,
    private translocoService: TranslocoService,
    private businessCentralExportSettingsService: BusinessCentralExportSettingsService,
    private exportSettingsService: ExportSettingsService,
    public brandingService: BrandingService,
  ) {
    this.reimbursableExpenseGroupingDateOptions =
      this.businessCentralExportSettingsService.getReimbursableExpenseGroupingDateOptions();
    this.cccExpenseGroupingDateOptions = this.businessCentralExportSettingsService.getCCCExpenseGroupingDateOptions();
    this.expenseGroupByOptions = this.businessCentralExportSettingsService.getExpenseGroupByOptions();
    this.reimbursableExpensesExportTypeOptions =
      this.businessCentralExportSettingsService.getReimbursableExpensesExportTypeOptions();
    this.cccExpensesExportTypeOptions = this.businessCentralExportSettingsService.getCCCExpensesExportTypeOptions();
    this.reimbursableExpenseState = this.businessCentralExportSettingsService.getReimbursableExpenseState();
    this.cccExpenseState = this.businessCentralExportSettingsService.getCCCExpenseState();
    this.employeeFieldMappingOptions = this.businessCentralExportSettingsService.getEntityOptions();
    this.employeeMapOptions = this.businessCentralExportSettingsService.getEmployeeMappingOptions();
  }

  private constructPayloadAndSave(): void {
    this.isSaveInProgress = true;
    const exportSettingPayload = BusinessCentralExportSettingsService.createExportSettingPayload(
      this.exportSettingForm,
    );
    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe(
      (exportSettingResponse: BusinessCentralExportSettingGet) => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(
          ToastSeverity.SUCCESS,
          this.translocoService.translate('businessCentralExportSettings.saveSuccess'),
        );
        this.trackingService.trackTimeSpent(
          TrackingApp.BUSINESS_CENTRAL,
          Page.EXPORT_SETTING_BUSINESS_CENTRAL,
          this.sessionStartTime,
        );
        if (this.workspaceService.getOnboardingState() === BusinessCentralOnboardingState.EXPORT_SETTINGS) {
          this.trackingService.onOnboardingStepCompletion(
            TrackingApp.BUSINESS_CENTRAL,
            BusinessCentralOnboardingState.EXPORT_SETTINGS,
            2,
            exportSettingPayload,
          );
        } else {
          this.trackingService.onUpdateEvent(
            TrackingApp.BUSINESS_CENTRAL,
            BusinessCentralUpdateEvent.ADVANCED_SETTINGS_BUSINESS_CENTRAL,
            {
              phase: this.helper.getPhase(this.isOnboarding),
              oldState: this.exportSettings,
              newState: exportSettingResponse,
            },
          );
        }

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(BusinessCentralOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/business_central/onboarding/import_settings`]);
        }
      },
      () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(
          ToastSeverity.ERROR,
          this.translocoService.translate('businessCentralExportSettings.saveError'),
        );
      },
    );
  }

  save(): void {
    if (this.exportSettingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  refreshDimensions(isRefresh: boolean): void {
    this.businessCentralHelperService.importAttributes(isRefresh);
  }

  updateExpenseGroupingValues() {
    if (this.exportSettingForm.get('cccExportType')?.value === BusinessCentralExportType.JOURNAL_ENTRY) {
      this.exportSettingForm.get('cccExportGroup')?.setValue(ExpenseGroupedBy.EXPENSE);
    }

    if (this.exportSettingForm.get('reimbursableExportType')?.value === BusinessCentralExportType.JOURNAL_ENTRY) {
      this.exportSettingForm.get('reimbursableExportGroup')?.setValue(ExpenseGroupedBy.EXPENSE);
    }
  }

  private setupCustomWatchers(): void {
    this.exportSettingForm.controls.reimbursableExportGroup.valueChanges.subscribe((reimbursableExportGroup) => {
      this.reimbursableExpenseGroupingDateOptions = this.exportSettingsService.constructExportDateOptions(
        false,
        reimbursableExportGroup,
        this.exportSettingForm.controls.reimbursableExportDate.value,
      );

      this.exportSettingsService.clearInvalidDateOption(
        this.exportSettingForm.get('reimbursableExportDate'),
        this.reimbursableExpenseGroupingDateOptions,
      );
    });

    this.exportSettingForm.controls.cccExportGroup.valueChanges.subscribe((cccExportGroup) => {
      this.cccExpenseGroupingDateOptions = this.exportSettingsService.constructExportDateOptions(
        true,
        cccExportGroup,
        this.exportSettingForm.controls.cccExportDate.value,
      );

      this.exportSettingsService.clearInvalidDateOption(
        this.exportSettingForm.get('cccExportDate'),
        this.cccExpenseGroupingDateOptions,
      );
    });

    this.exportSettingForm
      .get('reimbursableExportType')
      ?.valueChanges.subscribe(() => this.updateExpenseGroupingValues());
    this.exportSettingForm.get('cccExportType')?.valueChanges.subscribe(() => this.updateExpenseGroupingValues());
  }

  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(debounceTime(1000)).subscribe((event: ExportSettingOptionSearch) => {
      if (event.destinationOptionKey === BCExportSettingDestinationOptionKey.BANK_ACCOUNT) {
        const observables = [
          this.mappingService.getPaginatedDestinationAttributes('BANK_ACCOUNT', event.searchTerm),
          this.mappingService.getPaginatedDestinationAttributes(
            'ACCOUNT',
            event.searchTerm,
            undefined,
            undefined,
            undefined,
            ['Assets', 'Liabilities'],
          ),
        ];

        forkJoin(observables).subscribe(([bankAccounts, accounts]) => {
          // Insert new options (if any) to existing options, and sort them
          const newOptions = [...bankAccounts.results, ...accounts.results];
          newOptions.forEach((newOption) => {
            if (
              !this.bankAccountOptions.find(
                (existingOption) => existingOption.destination_id === newOption.destination_id,
              )
            ) {
              this.bankAccountOptions.push(newOption);
            }
          });

          this.bankAccountOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
          this.isOptionSearchInProgress = false;
        });
      } else {
        let existingOptions: DestinationAttribute[];
        switch (event.destinationOptionKey) {
          case BCExportSettingDestinationOptionKey.VENDOR:
            existingOptions = this.vendorOptions;
            break;
        }

        this.mappingService
          .getPaginatedDestinationAttributes(event.destinationOptionKey, event.searchTerm)
          .subscribe((response) => {
            // Insert new options to existing options
            response.results.forEach((option) => {
              if (!existingOptions.find((existingOption) => existingOption.destination_id === option.destination_id)) {
                existingOptions.push(option);
              }
            });

            switch (event.destinationOptionKey) {
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

  addMissingOptions() {
    // Since pagination API response is a subset of all options, we're making use of the export settings response to fill in options

    if (this.exportSettings) {
      this.helperService.addDestinationAttributeIfNotExists({
        options: this.bankAccountOptions,
        value: this.exportSettings.default_ccc_bank_account_name,
        destination_id: this.exportSettings.default_ccc_bank_account_id,
      });
      this.helperService.addDestinationAttributeIfNotExists({
        options: this.bankAccountOptions,
        value: this.exportSettings.default_bank_account_name,
        destination_id: this.exportSettings.default_bank_account_id,
      });

      this.helperService.addDestinationAttributeIfNotExists({
        options: this.vendorOptions,
        value: this.exportSettings.default_vendor_name,
        destination_id: this.exportSettings.default_vendor_id,
      });
    }
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    const exportSettingValidatorRule: ExportSettingValidatorRule = {
      reimbursableExpense: [
        'reimbursableExportType',
        'reimbursableExportGroup',
        'reimbursableExportDate',
        'reimbursableExpenseState',
      ],
      creditCardExpense: ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState'],
    };

    const exportModuleRule: ExportModuleRule[] = [
      {
        formController: 'reimbursableExportType',
        requiredValue: {
          JOURNAL_ENTRY: ['defaultBankName'],
        },
      },
      {
        formController: 'cccExportType',
        requiredValue: {
          JOURNAL_ENTRY: ['cccDefaultBankName', 'journalEntryNamePreference'],
        },
      },
    ];
    const commonFormFields: string[] = [];

    const destinationAttributes = [BusinessCentralField.ACCOUNT, FyleField.VENDOR];

    const groupedAttributes = destinationAttributes.map((destinationAttribute) =>
      this.mappingService
        .getPaginatedDestinationAttributes(destinationAttribute)
        .pipe(filter((response) => !!response)),
    );

    // For reimbursable default bank account options
    const reimbursableBankAccountAttributes = [
      this.mappingService.getPaginatedDestinationAttributes('BANK_ACCOUNT'),
      this.mappingService.getPaginatedDestinationAttributes('ACCOUNT', undefined, undefined, undefined, undefined, [
        'Assets',
        'Liabilities',
      ]),
    ];

    forkJoin([
      this.exportSettingService.getExportSettings().pipe(catchError(() => of(null))),
      ...groupedAttributes,
      ...reimbursableBankAccountAttributes,
    ]).subscribe(([exportSettingsResponse, accounts, vendors, reimbursableBankAccounts, reimbursableAccounts]) => {
      this.exportSettings = exportSettingsResponse;

      if (exportSettingsResponse) {
        this.helperService.addDestinationAttributeIfNotExists({
          options: accounts.results,
          value: exportSettingsResponse?.default_bank_account_name,
          destination_id: exportSettingsResponse?.default_bank_account_id,
        });

        this.helperService.addDestinationAttributeIfNotExists({
          options: vendors.results,
          value: exportSettingsResponse?.default_vendor_name,
          destination_id: exportSettingsResponse?.default_vendor_id,
        });
      }

      this.vendorOptions = vendors.results;
      this.bankAccountOptions = [...reimbursableBankAccounts.results, ...reimbursableAccounts.results];
      this.bankAccountOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
      this.addMissingOptions();
      this.exportSettingForm = BusinessCentralExportSettingsService.mapAPIResponseToFormGroup(
        this.exportSettings,
        this.bankAccountOptions,
        vendors.results,
      );

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      this.helper.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);
      this.helper.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm, commonFormFields);

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

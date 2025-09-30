import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, ExpenseGroupingFieldOption, Sage50ExportSettingDestinationOptionKey, Sage50OnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Sage50ExportSettingsService, FIELD_DEPENDENCIES } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50CCCExpensesDate, Sage50ExpensesGroupedBy, Sage50ExportSettingsForm, Sage50ReimbursableExpenseDate, Sage50ExportSettingsGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { catchError, debounceTime, forkJoin, Observable, of, startWith, Subject } from 'rxjs';
import { DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-mapping.service';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { Router } from '@angular/router';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TranslocoService } from '@jsverse/transloco';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { HelperService } from 'src/app/core/services/common/helper.service';

@Component({
  selector: 'app-sage50-export-settings',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './sage50-export-settings.component.html',
  styleUrl: './sage50-export-settings.component.scss'
})
export class Sage50ExportSettingsComponent implements OnInit {

  readonly appName = AppName.SAGE50;

  readonly redirectLink = brandingKbArticles.onboardingArticles.SAGE50.EXPORT_SETTINGS;

  readonly brandingStyle = brandingStyle;

  readonly brandingConfig = brandingConfig;

  readonly Sage50ExportSettingDestinationOptionKey = Sage50ExportSettingDestinationOptionKey;

  readonly ConfigurationCtaText = ConfigurationCta;

  readonly allowedAccountTypes: string[] = [
    'Accounts Payable', 'Long Term Liabilities', 'Other Current Liabilities'
  ] as const;

  // Static options
  readonly reimbursableExportTypes = this.exportSettingService.sage50ReimbursableExportTypeOptions;

  readonly cccExportTypes = this.exportSettingService.sage50CCCExportTypeOptions;

  readonly reimbursableExpenseStates = this.exportSettingService.sage50ReimbursableExpenseStateOptions;

  readonly cccExpenseStates = this.exportSettingService.sage50CCCExpenseStateOptions;

  readonly expenseGroupingOptions = this.exportSettingService.sage50ExpenseGroupingOptions;

  readonly reimbursableDateOptions: SelectFormOption[] = this.exportSettingService.getExpenseGroupingDateOptions();

  // Dynamic options
  cccExpenseDateOptions: SelectFormOption[];

  accounts: DestinationAttribute[];

  vendors: DestinationAttribute[];

  // Form
  exportSettingsForm: FormGroup<Sage50ExportSettingsForm>;

  // Flags
  isLoading: boolean;

  isSaveInProgress: boolean;

  isOptionSearchInProgress: boolean;

  isOnboarding: boolean;

  // Subject for advanced search
  optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  // Utility methods for the template
  get isCCCExportDateDisabled(): boolean {
    return this.exportSettingsForm.get('cccExportGroup')?.value === Sage50ExpensesGroupedBy.REPORT;
  }

  getSelectedLabel(field: keyof Sage50ExportSettingsForm): string | null{
    const selectedValue = this.exportSettingsForm.get(field)?.value;
    const selectedLabel = this.reimbursableDateOptions.find(option => option.value === selectedValue)?.label;
    return new LowerCasePipe().transform(selectedLabel);
  }

  showField(field: keyof Sage50ExportSettingsForm): boolean {
    const condition = FIELD_DEPENDENCIES.get(field);
    return condition ? condition(this.exportSettingsForm) : true;
  }

  constructor(
    private exportSettingService: Sage50ExportSettingsService,
    private mappingService: Sage50MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService,
    private workspaceService: WorkspaceService,
    private helperService: HelperService
  ) { }

  onSave(): void {
    this.isSaveInProgress = true;
    this.exportSettingService.constructPayloadAndPost(this.exportSettingsForm).subscribe({
      next: () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(
          ToastSeverity.SUCCESS,
          this.translocoService.translate('sage50ExportSettings.exportSettingsSavedSuccess')
        );

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(Sage50OnboardingState.IMPORT_SETTINGS);
          this.router.navigate(['/integrations/sage50/onboarding/import_settings']);
        }
      },
      error: () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(
          ToastSeverity.ERROR,
          this.translocoService.translate('sage50ExportSettings.exportSettingsSaveError')
        );
      }
    });
  }

  onBackButtonClick(): void {
    this.router.navigate(['/integrations/sage50/onboarding/export_settings']);
  }

  onAdvancedSearch(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }

  showPaymentMethodPreview() {
    // TODO: Implement payment method preview
  }

  private addMissingOptionsAndSort(exportSettings: Sage50ExportSettingsGet | null): void {
    const extraAccountOptions = [
      exportSettings?.reimbursable_default_credit_line_account,
      exportSettings?.reimbursable_default_account_payable_account,
      exportSettings?.ccc_default_credit_line_account,
      exportSettings?.ccc_default_account_payable_account,
      exportSettings?.default_cash_account,
      exportSettings?.default_payment_method
    ];

    for (const account of extraAccountOptions) {
      if (account && !this.accounts.find((existingAccount) => existingAccount.id === account.id)) {
        this.accounts.push(account);
      }
    }

    const extraVendor = exportSettings?.default_vendor;
    if (extraVendor && !this.vendors.find((existingVendor) => existingVendor.id === extraVendor.id)) {
      this.vendors.push(extraVendor);
    }

    this.accounts.sort((a, b) => a.value.localeCompare(b.value));
    this.vendors.sort((a, b) => a.value.localeCompare(b.value));
  }

  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event) => {
      let options: DestinationAttribute[] = [];
      let destinationAttributesObservable: Observable<PaginatedDestinationAttribute>;
      switch (event.destinationOptionKey) {
        case Sage50ExportSettingDestinationOptionKey.ACCOUNT:
          options = this.accounts;
          destinationAttributesObservable = this.mappingService.getAccounts(this.allowedAccountTypes, event.searchTerm);
          break;
        case Sage50ExportSettingDestinationOptionKey.VENDOR:
          options = this.vendors;
          destinationAttributesObservable = this.mappingService.getVendors(event.searchTerm);
          break;
        default:
          return;
      }

      destinationAttributesObservable.subscribe((response) => {
        response.results.forEach((option) => {
          if (!options.find((existingOption) => existingOption.destination_id === option.destination_id)) {
            options.push(option);
          }
        });

        options.sort((a, b) => a.value.localeCompare(b.value));

        switch (event.destinationOptionKey) {
          case Sage50ExportSettingDestinationOptionKey.ACCOUNT:
            this.accounts = options.concat();
            break;
          case Sage50ExportSettingDestinationOptionKey.VENDOR:
            this.vendors = options.concat();
            break;
        }

        this.isOptionSearchInProgress = false;
      });
    });
  }

  private setupFieldWatchers(): void {
    // Toggle field watchers - clear export type if the corresponding toggle is turned off
    this.exportSettingsForm.get('reimbursableExpenses')?.valueChanges
      .pipe(startWith(this.exportSettingsForm.get('reimbursableExpenses')?.value)) // Manually trigger on init
      .subscribe((reimbursableExpenses) => {
        if (!reimbursableExpenses) {
          this.exportSettingsForm.get('reimbursableExportType')?.setValue(null);
        }
      });

    this.exportSettingsForm.get('cccExpenses')?.valueChanges
      .pipe(startWith(this.exportSettingsForm.get('cccExpenses')?.value)) // Manually trigger on init
      .subscribe((cccExpenses) => {
        if (!cccExpenses) {
          this.exportSettingsForm.get('cccExportType')?.setValue(null);
        }
      });

    // Watchers for date fields
    this.exportSettingsForm.get('reimbursableExportGroup')?.valueChanges
      .pipe(startWith(this.exportSettingsForm.get('reimbursableExportGroup')?.value)) // Manually trigger on init
      .subscribe((reimbursableExportGroup) => {
        // On reimbursable export group change, update only the date value
        if (reimbursableExportGroup === Sage50ExpensesGroupedBy.EXPENSE) {
          this.exportSettingsForm.get('reimbursableExportDate')?.setValue(Sage50ReimbursableExpenseDate.SPENT_AT);
        } else if (reimbursableExportGroup === Sage50ExpensesGroupedBy.REPORT) {
          this.exportSettingsForm.get('reimbursableExportDate')?.setValue(Sage50ReimbursableExpenseDate.CURRENT_DATE);
        }
    });

    this.exportSettingsForm.get('cccExportGroup')?.valueChanges
      .pipe(startWith(this.exportSettingsForm.get('cccExportGroup')?.value)) // Manually trigger on init
      .subscribe((cccExportGroup) => {
        // On ccc export group change, 1. update date options
        const expenseGroupingFieldOption = {
          [Sage50ExpensesGroupedBy.EXPENSE]: ExpenseGroupingFieldOption.EXPENSE,
          [Sage50ExpensesGroupedBy.REPORT]: ExpenseGroupingFieldOption.REPORT
        };

        let newOptions = this.exportSettingService.constructExportDateOptions(
          true, expenseGroupingFieldOption[cccExportGroup!], null
        );

        if (cccExportGroup === Sage50ExpensesGroupedBy.EXPENSE) {
          // Sage50 only: remove current_date when grouping by expense
          newOptions = newOptions.filter(option => option.value !== Sage50CCCExpensesDate.CURRENT_DATE);
        }

        this.cccExpenseDateOptions = newOptions;

        // 2. update date value as well
        if (cccExportGroup === Sage50ExpensesGroupedBy.REPORT) {
          this.exportSettingsForm.get('cccExportDate')?.setValue(Sage50CCCExpensesDate.CURRENT_DATE);
        } else if (cccExportGroup === Sage50ExpensesGroupedBy.EXPENSE) {
          this.exportSettingsForm.get('cccExportDate')?.setValue(Sage50CCCExpensesDate.POSTED_AT);
        }
    });
  }

  ngOnInit(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.isLoading = true;

    const attributesByAccountType = this.allowedAccountTypes.map(accountType =>
      this.mappingService.getAccounts([accountType])
    );

    forkJoin([
      this.exportSettingService.getExportSettings().pipe(catchError(() => of(null))),
      ...attributesByAccountType,
      this.mappingService.getVendors()
    ]).subscribe(([exportSettings, accountsPayable, longTermLiabilities, otherCurrentLiabilities, vendors]) => {
      this.accounts = [
        ...accountsPayable.results,
        ...longTermLiabilities.results,
        ...otherCurrentLiabilities.results
      ];

      this.vendors = vendors.results;

      this.exportSettingsForm = this.exportSettingService.mapApiResponseToFormGroup(exportSettings, this.accounts, this.vendors);

      this.addMissingOptionsAndSort(exportSettings);
      this.optionSearchWatcher();
      this.setupFieldWatchers();

      this.isLoading = false;
    });
  }
}

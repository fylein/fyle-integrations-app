import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ExpenseGroupingFieldOption, Sage50ExportSettingDestinationOptionKey } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50CCCExpensesDate, Sage50ExpensesGroupedBy, Sage50ExportSettings, Sage50ExportSettingsForm, Sage50ReimbursableExpenseDate } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { catchError, debounceTime, forkJoin, Observable, of, startWith, Subject } from 'rxjs';
import { DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-mapping.service';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';

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
  exportSettingForm: FormGroup<Sage50ExportSettingsForm>;

  // Loaders' states
  isLoading: boolean;

  isSaveInProgress: boolean;

  isOptionSearchInProgress: boolean;

  // Subject for advanced search
  optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  // Utility methods for the template
  get isCCCExportDateDisabled(): boolean {
    return this.exportSettingForm.get('cccExportGroup')?.value === Sage50ExpensesGroupedBy.REPORT;
  }

  getSelectedLabel(field: keyof Sage50ExportSettingsForm): string | null{
    const selectedValue = this.exportSettingForm.get(field)?.value;
    const selectedLabel = this.reimbursableDateOptions.find(option => option.value === selectedValue)?.label;
    return new LowerCasePipe().transform(selectedLabel);
  }

  showField(field: keyof Sage50ExportSettingsForm) {
    return true;
  }

  constructor(
    private exportSettingService: Sage50ExportSettingsService,
    private mappingService: Sage50MappingService
  ) { }

  onAdvancedSearch(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }

  showPaymentMethodPreview() {
    // TODO: Implement payment method preview
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
    // Watchers for date fields
    this.exportSettingForm.get('reimbursableExportGroup')?.valueChanges
      .pipe(startWith(this.exportSettingForm.get('reimbursableExportGroup')?.value)) // Manually trigger on init
      .subscribe((reimbursableExportGroup) => {
        // On reimbursable export group change, update only the date value
        if (reimbursableExportGroup === Sage50ExpensesGroupedBy.EXPENSE) {
          this.exportSettingForm.get('reimbursableExportDate')?.setValue(Sage50ReimbursableExpenseDate.SPENT_AT);
        } else if (reimbursableExportGroup === Sage50ExpensesGroupedBy.REPORT) {
          this.exportSettingForm.get('reimbursableExportDate')?.setValue(Sage50ReimbursableExpenseDate.CURRENT_DATE);
        }
    });

    this.exportSettingForm.get('cccExportGroup')?.valueChanges
      .pipe(startWith(this.exportSettingForm.get('cccExportGroup')?.value)) // Manually trigger on init
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
          this.exportSettingForm.get('cccExportDate')?.setValue(Sage50CCCExpensesDate.CURRENT_DATE);
        } else if (cccExportGroup === Sage50ExpensesGroupedBy.EXPENSE) {
          this.exportSettingForm.get('cccExportDate')?.setValue(Sage50CCCExpensesDate.POSTED_AT);
        }
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

    const attributesByAccountType = this.allowedAccountTypes.map(accountType =>
      this.mappingService.getAccounts([accountType])
    );

    forkJoin([
      this.exportSettingService.getExportSettings().pipe(catchError(() => of(null))),
      ...attributesByAccountType,
      this.mappingService.getVendors()
    ]).subscribe(([exportSettings, accountsPayable, longTermLiabilities, otherCurrentLiabilities, vendors]) => {
      this.exportSettingForm = this.exportSettingService.mapApiResponseToFormGroup(exportSettings);

      this.accounts = [
        ...accountsPayable.results,
        ...longTermLiabilities.results,
        ...otherCurrentLiabilities.results
      ].sort((a, b) => a.value.localeCompare(b.value));

      this.vendors = vendors.results;

      this.optionSearchWatcher();
      this.setupFieldWatchers();

      this.isLoading = false;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, Sage50AttributeType, Sage50ExportSettingDestinationOptionKey } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50ExportSettings, Sage50ExportSettingsForm } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { catchError, debounceTime, forkJoin, of, Subject } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-mapping.service';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';

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

  // Options
  readonly reimbursableExportTypes = this.exportSettingService.sage50ReimbursableExportTypeOptions;

  readonly cccExportTypes = this.exportSettingService.sage50CCCExportTypeOptions;

  readonly reimbursableExpenseState = this.exportSettingService.sage50ReimbursableExpenseStateOptions;

  readonly cccExpenseState = this.exportSettingService.sage50CCCExpenseStateOptions;

  readonly expenseGroupingOptions = this.exportSettingService.sage50ExpenseGroupingOptions;

  readonly cccExpenseDateOptions = this.exportSettingService.sage50CCCExpenseDateOptions;

  accounts: DestinationAttribute[];

  // Form
  exportSettingForm: FormGroup<Sage50ExportSettingsForm>;

  // API responses
  exportSettings: Sage50ExportSettings | null;

  // Loaders' states
  isLoading: boolean;

  isSaveInProgress: boolean;

  isOptionSearchInProgress: boolean;

  // Subject for advanced search
  optionSearchUpdate = new Subject<ExportSettingOptionSearch>();


  constructor(
    private exportSettingService: Sage50ExportSettingsService,
    private mappingService: Sage50MappingService
  ) { }

  showField(field: keyof Sage50ExportSettingsForm) {
    return true;
  }

  onAdvancedSearch(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }

  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event) => {
      this.mappingService.getAccounts(this.allowedAccountTypes, event.searchTerm).subscribe((response) => {
        response.results.forEach((option) => {
          if (!this.accounts.find((existingOption) => existingOption.destination_id === option.destination_id)) {
            this.accounts.push(option);
          }
        });

        this.accounts.sort((a, b) => a.value.localeCompare(b.value));
        this.isOptionSearchInProgress = false;
      });
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

    const attributesByAccountType = this.allowedAccountTypes.map(accountType =>
      this.mappingService.getAccounts([accountType])
    );

    forkJoin([
      this.exportSettingService.getExportSettings().pipe(catchError(() => of(null))),
      ...attributesByAccountType
    ]).subscribe(([exportSettings, accountsPayable, longTermLiabilities, otherCurrentLiabilities]) => {
      this.exportSettings = exportSettings;
      this.exportSettingForm = this.exportSettingService.mapApiResponseToFormGroup(exportSettings);

      this.accounts = [
        ...accountsPayable.results,
        ...longTermLiabilities.results,
        ...otherCurrentLiabilities.results
      ].sort((a, b) => a.value.localeCompare(b.value));

      this.optionSearchWatcher();

      this.isLoading = false;
    });
  }
}

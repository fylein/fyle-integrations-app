import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles, brandingStyle, brandingDemoVideoLinks } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, ExpenseGroupingFieldOption, Sage50AttributeType, Sage50ExportSettingDestinationOptionKey, Sage50OnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Sage50ExportSettingsService, FIELD_DEPENDENCIES } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50CCCExpensesDate, Sage50CCCExportType, Sage50ExpensesGroupedBy, Sage50ExportSettingsForm, Sage50ReimbursableExpenseDate, Sage50ReimbursableExportType, Sage50ExportSettingsGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { catchError, debounceTime, forkJoin, Observable, of, pairwise, startWith, Subject } from 'rxjs';
import { DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-core/sage50-mapping.service';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { Router } from '@angular/router';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TranslocoService } from '@jsverse/transloco';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { Sage50Workspace } from 'src/app/core/models/sage50/db/sage50-workspace.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { Sage50ImportAttributesService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-attributes.service';
import { CsvUploadDialogComponent } from 'src/app/shared/components/dialog/csv-upload-dialog/csv-upload-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadedCSVFile } from 'src/app/core/models/misc/configuration-csv-import-field.model';

@Component({
  selector: 'app-sage50-export-settings',
  standalone: true,
  imports: [SharedModule, CommonModule],
  providers: [DialogService],
  templateUrl: './sage50-export-settings.component.html',
  styleUrl: './sage50-export-settings.component.scss'
})
export class Sage50ExportSettingsComponent implements OnInit {

  // Constants
  readonly appName = AppName.SAGE50;

  readonly redirectLink = brandingKbArticles.onboardingArticles.SAGE50.EXPORT_SETTINGS;

  readonly brandingStyle = brandingStyle;

  readonly brandingConfig = brandingConfig;

  readonly brandingKbArticles = brandingKbArticles;

  readonly brandingDemoVideoLinks = brandingDemoVideoLinks;

  readonly Sage50ExportSettingDestinationOptionKey = Sage50ExportSettingDestinationOptionKey;

  readonly Sage50AttributeType = Sage50AttributeType;

  readonly ConfigurationCtaText = ConfigurationCta;

  readonly ConfigurationWarningEvent = ConfigurationWarningEvent;

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

  isPaymentMethodPreviewDialogVisible: boolean;

  isReimbursableEnabled = true;

  isCCCEnabled = true;

  isCCCExportGroupEditable = true;

  showPurchasesExportWarning: boolean = false;

  selectedExportTypeName: string;

  vendorUploadDialogRef?: DynamicDialogRef;

  // Track the last known good values to prevent race conditions
  private lastReimbursableExportType: Sage50ReimbursableExportType | null = null;

  private lastCCCExportType: Sage50CCCExportType | null = null;

  private pendingExportChange: {
    expenseType: 'reimbursable' | 'ccc';
    previousValue: Sage50ReimbursableExportType | Sage50CCCExportType | null;
    newValue: Sage50ReimbursableExportType | Sage50CCCExportType;
  } | null = null;

  // Subject for advanced search
  optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  // Utility methods for the template
  get isCCCExportDateDisabled(): boolean {
    return this.exportSettingsForm.get('cccExportGroup')?.value === Sage50ExpensesGroupedBy.REPORT;
  }

  get cccExportDateSubLabel(): string {
    return this.isCCCExportDateDisabled ?
      this.translocoService.translate('sage50ExportSettings.cccExportDateFixedSubLabel', {
        selectedDateOption: this.getSelectedLabel('cccExportDate') ?? 'date',
        brandName: brandingConfig.brandName
      }) :
      this.translocoService.translate('sage50ExportSettings.cccExportDateEditableSubLabel');
  }

  getSelectedLabel(field: keyof Sage50ExportSettingsForm): string | null{
    const selectedValue = this.exportSettingsForm.get(field)?.value;
    const selectedLabel = this.reimbursableDateOptions.find(option => option.value === selectedValue)?.label;
    return selectedLabel ? new LowerCasePipe().transform(selectedLabel) : null;
  }

  showField(field: keyof Sage50ExportSettingsForm): boolean {
    const condition = FIELD_DEPENDENCIES.get(field);
    const showToggles = this.isReimbursableEnabled && this.isCCCEnabled;
    return condition ? condition(this.exportSettingsForm, showToggles) : true;
  }

  constructor(
    private exportSettingService: Sage50ExportSettingsService,
    private mappingService: Sage50MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService,
    private workspaceService: WorkspaceService,
    private userService: IntegrationsUserService,
    private sage50ImportAttributesService: Sage50ImportAttributesService,
    private dialogService: DialogService
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

        const hasMappings = this.exportSettingsForm.get('reimbursableExportType')?.value === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY || this.exportSettingsForm.get('cccExportType')?.value === Sage50CCCExportType.PAYMENTS_JOURNAL;
        this.mappingService.shouldShowMappingPage.emit(hasMappings);

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
    this.router.navigate(['/integrations/sage50/onboarding/prerequisites']);
  }

  onAdvancedSearch(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }

  showPaymentMethodPreview() {
    this.isPaymentMethodPreviewDialogVisible = true;
  }

  closePaymentMethodPreviewDialog() {
    this.isPaymentMethodPreviewDialogVisible = false;
  }

  onExportTypeDropdownChange(changeEvent: {event: any, formControllerName: string}): void {
    const { event, formControllerName } = changeEvent;
    const selectedExportType = event.value;

    // Get the previous export type from our tracking variables (not from form control which is already updated)
    const previousExportType = formControllerName === 'reimbursableExportType'
      ? this.lastReimbursableExportType
      : this.lastCCCExportType;

    // Check if we need to show warning for purchases/payments
    const needsWarning = this.shouldShowPurchasesWarning(selectedExportType, formControllerName);

    if (needsWarning) {
      // Revert to the previous value immediately
      this.exportSettingsForm.get(formControllerName)?.setValue(previousExportType, { emitEvent: false });
      this.exportSettingsForm.get(formControllerName)?.updateValueAndValidity();

      // Store pending change and show warning
      this.pendingExportChange = {
        expenseType: formControllerName === 'reimbursableExportType' ? 'reimbursable' : 'ccc',
        previousValue: previousExportType,
        newValue: selectedExportType
      };

      this.selectedExportTypeName = selectedExportType === Sage50CCCExportType.PAYMENTS_JOURNAL
        ? this.translocoService.translate('sage50ExportSettings.paymentsLabel')
        : this.translocoService.translate('sage50ExportSettings.purchasesLabel');
      this.showPurchasesExportWarning = true;
    } else {
      // Update tracking variable with the new value since no warning is needed
      if (formControllerName === 'reimbursableExportType') {
        this.lastReimbursableExportType = selectedExportType;
      } else {
        this.lastCCCExportType = selectedExportType;
      }
    }
  }

  private shouldShowPurchasesWarning(selectedExportType: any, formControllerName: string): boolean {
    const hasVendorsUploaded = this.vendors && this.vendors.length > 0;

    if (hasVendorsUploaded) {
      return false;
    }

    if (formControllerName === 'reimbursableExportType') {
      return selectedExportType === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY;
    } else if (formControllerName === 'cccExportType') {
      return [Sage50CCCExportType.PAYMENTS_JOURNAL, Sage50CCCExportType.PURCHASES_RECEIVE_INVENTORY].includes(selectedExportType);
    }

    return false;
  }

  acceptPurchasesExportWarning(data: ConfigurationWarningOut): void {
    this.showPurchasesExportWarning = false;

    if (data.hasAccepted && this.pendingExportChange) {
      this.openVendorUploadDialog();
    } else {
      this.pendingExportChange = null;
    }
  }

  private openVendorUploadDialog(): void {
    this.vendorUploadDialogRef = this.dialogService.open(CsvUploadDialogComponent, {
      showHeader: false,
      data: {
        attributeType: Sage50AttributeType.VENDOR,
        articleLink: this.brandingKbArticles.postOnboardingArticles.SAGE50.VENDOR,
        uploadData: this.uploadVendorData.bind(this),
        videoURL: this.brandingDemoVideoLinks.postOnboarding.SAGE50.VENDOR
      }
    });

    this.vendorUploadDialogRef.onClose.subscribe((file: UploadedCSVFile | undefined) => {
      if (file?.name) {
        this.applyPendingExportTypeChange();
        this.mappingService.getVendors().subscribe((vendors) => {
          this.vendors = vendors.results;
        });
      }

      this.pendingExportChange = null;
    });
  }

  private applyPendingExportTypeChange(): void {
    if (this.pendingExportChange) {
      const { expenseType, newValue: selectedExportType } = this.pendingExportChange;
      const formControl = expenseType === 'reimbursable'
        ? this.exportSettingsForm.get('reimbursableExportType')
        : this.exportSettingsForm.get('cccExportType');

      if (formControl) {
        formControl.setValue(selectedExportType as any, { emitEvent: false });
        formControl.markAsTouched();
        formControl.updateValueAndValidity();
      }

      // Update tracking variables with the accepted value
      if (expenseType === 'reimbursable') {
        this.lastReimbursableExportType = selectedExportType as Sage50ReimbursableExportType;
      } else {
        this.lastCCCExportType = selectedExportType as Sage50CCCExportType;
      }
    }
  }

  uploadVendorData(attributeType: Sage50AttributeType, fileName: string, jsonData: any) {
    return this.sage50ImportAttributesService.importAttributes(attributeType, fileName, jsonData);
  }

  private addMissingOptionsAndSort(exportSettings: Sage50ExportSettingsGet | null): void {
    const extraAccountOptions = [
      exportSettings?.reimbursable_default_credit_line_account,
      exportSettings?.reimbursable_default_account_payable_account,
      exportSettings?.ccc_default_credit_line_account,
      exportSettings?.ccc_default_account_payable_account,
      exportSettings?.default_cash_account
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

    this.accounts.sort((a, b) => a.value?.localeCompare(b.value));
    this.vendors.sort((a, b) => a.value?.localeCompare(b.value));
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
          if (option && !options.find((existingOption) => existingOption.destination_id === option.destination_id)) {
            options.push(option);
          }
        });

        options.sort((a, b) => a.value?.localeCompare(b.value));

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

    // Watcher for CCC export type -> hard-code CCC export group
    // The CCC export group is always EXPENSE when the CCC export type is Payments / Purcheses
    this.exportSettingsForm.get('cccExportType')?.valueChanges
      .pipe(startWith(this.exportSettingsForm.get('cccExportType')?.value)) // Manually trigger on init
      .subscribe((cccExportType) => {
        if ([Sage50CCCExportType.PAYMENTS_JOURNAL, Sage50CCCExportType.PURCHASES_RECEIVE_INVENTORY].includes(cccExportType!)) {
          this.exportSettingsForm.get('cccExportGroup')?.setValue(Sage50ExpensesGroupedBy.EXPENSE);
          this.isCCCExportGroupEditable = false;
        } else {
          this.isCCCExportGroupEditable = true;
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
      this.workspaceService.getWorkspace(this.userService.getUserProfile().org_id) as Observable<Sage50Workspace[]>,
      ...attributesByAccountType,
      this.mappingService.getVendors()
    ]).subscribe(([exportSettings, workspaces, accountsPayable, longTermLiabilities, otherCurrentLiabilities, vendors]) => {

      // Set the payment method enabled flags based on the workspace settings
      const paymentModes = workspaces?.[0]?.org_settings?.enabled_payment_modes;
      if (paymentModes?.length > 0) {
        this.isReimbursableEnabled = paymentModes.includes("REIMBURSABLE");
        this.isCCCEnabled = paymentModes.includes("CREDIT_CARD");
      }

      this.accounts = [
        ...accountsPayable.results,
        ...longTermLiabilities.results,
        ...otherCurrentLiabilities.results
      ];

      this.vendors = vendors.results;

      this.exportSettingsForm = this.exportSettingService.mapApiResponseToFormGroup(
        exportSettings, this.isReimbursableEnabled, this.isCCCEnabled
      );

      // Initialize tracking variables for warning dialog with current form values
      this.lastReimbursableExportType = this.exportSettingsForm.get('reimbursableExportType')?.value || null;
      this.lastCCCExportType = this.exportSettingsForm.get('cccExportType')?.value || null;

      this.addMissingOptionsAndSort(exportSettings);
      this.optionSearchWatcher();
      this.setupFieldWatchers();

      this.isLoading = false;
    });
  }
}


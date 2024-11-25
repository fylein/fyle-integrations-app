import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, ConfigurationCta, EmployeeFieldMapping, QBDCorporateCreditCardExpensesObject, QbdDirectExpenseGroupBy, QbdDirectExportSettingDestinationOptionKey, QbdDirectOnboardingState, QbdDirectReimbursableExpensesObject, QBDExpenseGroupedBy, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QbdDirectExportSettingGet, QbdDirectExportSettingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { catchError, debounceTime, filter, forkJoin, Observable, of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { EmployeeSettingModel } from 'src/app/core/models/common/employee-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { QbdDirectDestinationAttribute } from 'src/app/core/models/qbd-direct/db/qbd-direct-destination-attribuite.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';

@Component({
  selector: 'app-qbd-direct-export-settings',
  templateUrl: './qbd-direct-export-settings.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  styleUrl: './qbd-direct-export-settings.component.scss'
})
export class QbdDirectExportSettingsComponent implements OnInit{

  isLoading: boolean;

  isOnboarding: any;

  exportSettings: QbdDirectExportSettingGet | null;

  exportSettingsForm: FormGroup;

  cccExpenseGroupingDateOptions: QBDExportSettingFormOption[];

  cccExpenseStateOptions: QBDExportSettingFormOption[];

  expenseStateOptions: QBDExportSettingFormOption[];

  reimbursableExpenseGroupingFieldOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.expenseGroupingFieldOptions();

  creditCardExpenseGroupingFieldOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.expenseGroupingFieldOptions();

  reimbursableExpenseGroupingDateOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.reimbursableExpenseGroupingDateOptions();

  creditCardExportTypes: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.creditCardExportTypes();

  reimbursableExportTypes: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.reimbursableExportTypes();

  nameInJEOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.nameInJEOptions();

  employeeMappingOptions: SelectFormOption[] = EmployeeSettingModel.getEmployeeFieldMappingOptions();

  appName: AppName = AppName.QBD_DIRECT;

  redirectLink: string = brandingKbArticles.topLevelArticles.QBD_DIRECT;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent.qbd_direct.configuration.exportSetting;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  QBDCorporateCreditCardExpensesObject = QBDCorporateCreditCardExpensesObject;

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  destinationAccounts: QbdDirectDestinationAttribute[];


  QbdDirectExportSettingDestinationOptionKey = QbdDirectExportSettingDestinationOptionKey;

  isOptionSearchInProgress: boolean;

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  constructor(
    private router: Router,
    private exportSettingService: QbdDirectExportSettingsService,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private qbdDirectHelperService: QbdDirectHelperService
  ) { }

  isEmployeeMappingDisabled(): boolean {
    if (this.exportSettingsForm.get('reimbursableExportType')?.value === QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY || (!this.exportSettingsForm.get('reimbursableExpense')?.value && this.exportSettingsForm.get('creditCardExportType')?.value === QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY)) {
      return false;
    }
    return true;
  }

  cccAccpuntOptions(cccExportType: string): DestinationAttribute[] {
    if (cccExportType === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
      return this.destinationOptionsWatcher(['CreditCard'], this.destinationAccounts);
    }
    return this.destinationOptionsWatcher(['Bank', 'AccountsPayable', 'CreditCard', 'OtherCurrentLiability', 'LongTermLiability'], this.destinationAccounts);
  }

  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: ExportSettingOptionSearch) => {
      let existingOptions: QbdDirectDestinationAttribute[] = [];

      existingOptions = this.destinationAccounts;

      let newOptions: QbdDirectDestinationAttribute[];

      this.mappingService.getPaginatedDestinationAttributes(event.destinationOptionKey, event.searchTerm).subscribe((response) => {

        // Convert DestinationAttributes to DefaultDestinationAttributes (name, id)
        newOptions = response.results as QbdDirectDestinationAttribute[];

        // Insert new options to existing options
        newOptions.forEach((option) => {
          if (!existingOptions.find((existingOption) => existingOption.id === option.id)) {
            existingOptions.push(option);
          }
        });

        this.destinationAccounts = existingOptions.concat();
        this.destinationAccounts.sort((a, b) => (a.value || '').localeCompare(b.value || ''));

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

  save() {
    this.isSaveInProgress = true;
      const exportSettingPayload = QbdDirectExportSettingModel.constructPayload(this.exportSettingsForm);
      this.exportSettingService.postQbdExportSettings(exportSettingPayload).subscribe((response: QbdDirectExportSettingGet) => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(QbdDirectOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/qbd_direct/onboarding/import_settings`]);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
  }

  navigateToPreviousStep() {
    this.router.navigate([`/integrations/qbd_direct/onboarding/connector`]);
  }

  refreshDimensions() {
    this.qbdDirectHelperService.importAttribuites(true);
  }

  cccExportTypeWatcher(): void {
    this.exportSettingsForm.controls.creditCardExportType.valueChanges.subscribe((creditCardExportTypeValue) => {
      if (creditCardExportTypeValue === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
        this.exportSettingsForm.controls.creditCardExportGroup.patchValue(this.creditCardExpenseGroupingFieldOptions[1].value);
        this.exportSettingsForm.controls.creditCardExportGroup.disable();
        this.creditCardExpenseGroupingFieldOptions = [QbdDirectExportSettingModel.expenseGroupingFieldOptions()[1]];
      } else {
        this.exportSettingsForm.controls.creditCardExportGroup.enable();
        this.creditCardExpenseGroupingFieldOptions = QbdDirectExportSettingModel.expenseGroupingFieldOptions();
      }
    });
  }

  reimbursableExpenseGroupWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportGroup.valueChanges.subscribe((reimbursableExportGroupValue) => {
      this.reimbursableExpenseGroupingDateOptions = QbdDirectExportSettingModel.setReimbursableExpenseGroupingDateOptions(reimbursableExportGroupValue);
    });
  }

  cccExpenseGroupWatcher(): void {
    this.exportSettingsForm.controls.creditCardExportGroup.valueChanges.subscribe((creditCardExportGroupValue) => {
      this.cccExpenseGroupingDateOptions = QbdDirectExportSettingModel.setCreditCardExpenseGroupingDateOptions(creditCardExportGroupValue);
    });
  }

  employeeMappingWatcher() {
    this.exportSettingsForm.controls.reimbursableExportType.valueChanges.subscribe((reimbursableExportTypeValue) => {
      if (reimbursableExportTypeValue === QbdDirectReimbursableExpensesObject.BILL) {
        this.exportSettingsForm.controls.employeeMapping.patchValue(EmployeeFieldMapping.VENDOR);
      }
      // Else if (reimbursableExportTypeValue === QbdDirectReimbursableExpensesObject.CHECK) {
      //   This.exportSettingsForm.controls.employeeMapping.patchValue(EmployeeFieldMapping.EMPLOYEE);
      // }
    });
  }

  destinationOptionsWatcher(detailAccountType: string[], destinationOptions: QbdDirectDestinationAttribute[]): DestinationAttribute[] {
    return destinationOptions.filter((account: QbdDirectDestinationAttribute) =>  detailAccountType.includes(account.detail.account_type));
  }

  private exportsettingsWatcher(): void {

    this.cccExportTypeWatcher();

    this.employeeMappingWatcher();

    this.reimbursableExpenseGroupWatcher();

    this.cccExpenseGroupWatcher();
  }

  private setupCCCExpenseGroupingDateOptions(): void {
    const creditCardExpenseExportGroup = this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : QbdDirectExpenseGroupBy.EXPENSE;
    this.cccExpenseGroupingDateOptions = QbdDirectExportSettingModel.setCreditCardExpenseGroupingDateOptions(creditCardExpenseExportGroup);
  }

  private setupReimbursableExpenseGroupingDateOptions(): void {
    const reimbursableExpenseExportGroup = this.exportSettings?.reimbursable_expense_grouped_by ? this.exportSettings?.reimbursable_expense_grouped_by : QbdDirectExpenseGroupBy.EXPENSE;
    this.cccExpenseGroupingDateOptions = QbdDirectExportSettingModel.setReimbursableExpenseGroupingDateOptions(reimbursableExpenseExportGroup);
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');

    const destinationAttributes = ['ACCOUNT'];

    const groupedAttributes: Observable<PaginatedDestinationAttribute>[]= [];

    destinationAttributes.forEach((destinationAttribute) => {
      groupedAttributes.push(this.mappingService.getPaginatedDestinationAttributes(destinationAttribute).pipe(filter(response => !!response)));
    });

    forkJoin([
      this.exportSettingService.getQbdExportSettings().pipe(catchError(() => of(null))),
      ...groupedAttributes
    ]).subscribe(([exportSettingResponse, accounts]) => {
      this.exportSettings = exportSettingResponse;

      this.cccExpenseStateOptions = QbdDirectExportSettingModel.cccExpenseStateOptions();
      this.expenseStateOptions = QbdDirectExportSettingModel.expenseStateOptions();

      this.destinationAccounts = accounts.results as QbdDirectDestinationAttribute[];

      this.setupReimbursableExpenseGroupingDateOptions();
      this.setupCCCExpenseGroupingDateOptions();

      this.exportSettingsForm = QbdDirectExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, this.destinationAccounts);

      this.helperService.addExportSettingFormValidator(this.exportSettingsForm);

      const [exportSettingValidatorRule, exportModuleRule] = QbdDirectExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingsForm);

      this.exportSettingService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingsForm);

      this.exportsettingsWatcher();

      this.optionSearchWatcher();

      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.getSettingsAndSetupForm();
  }

}

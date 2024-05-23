import { TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ExportSettingModel } from 'src/app/core/models/common/export-settings.model';
import { HelperUtility } from 'src/app/core/models/common/helper.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, FyleField, NameInJournalEntry, NetSuiteCorporateCreditCardExpensesObject, NetsuiteOnboardingState, NetsuiteReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { NetSuiteExportSettingGet, NetSuiteExportSettingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';

@Component({
  selector: 'app-netsuite-export-settings',
  templateUrl: './netsuite-export-settings.component.html',
  styleUrls: ['./netsuite-export-settings.component.scss']
})
export class NetsuiteExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.NETSUITE.EXPORT_SETTING;

  brandingConfig = brandingConfig;

  isOnboarding: boolean;

  windowReference: Window;

  exportSettings: NetSuiteExportSettingGet;

  employeeFieldMapping: EmployeeFieldMapping;

  bankAccounts: DefaultDestinationAttribute[];

  cccAccounts: DefaultDestinationAttribute[];

  creditCardVendors: DefaultDestinationAttribute[];

  accountsPayables: DefaultDestinationAttribute[];

  reimbursableExportTypes: SelectFormOption[] =  NetSuiteExportSettingModel.getReimbursableExportTypeOptions();

  autoMapEmployeeOptions: SelectFormOption[] = NetSuiteExportSettingModel.getAutoMapEmplyeeOptions();

  employeeFieldOptions: SelectFormOption[] = NetSuiteExportSettingModel.getEmployeeFieldOptions();

  creditCardExportTypes = brandingConfig.brandId === 'co' ? NetSuiteExportSettingModel.getCoCreditCardExportTypes() : NetSuiteExportSettingModel.getCreditCardExportTypes();

  cccExpenseStateOptions = NetSuiteExportSettingModel.getCCCExpenseStateOptions();

  expenseStateOptions = NetSuiteExportSettingModel.getReimbursableExpenseStateOptions();

  expenseGroupByOptions = NetSuiteExportSettingModel.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions = NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();

  nameInJournalOptions = NetSuiteExportSettingModel.getNameInJournalOptions();

  showNameInJournalOption: boolean;

  exportSettingForm: FormGroup;

  isSaveInProgress: boolean;

  isConfirmationDialogVisible: boolean;

  warningDialogText: string;

  appName: AppName = AppName.NETSUITE;

  readonly brandingContent = brandingContent.netsuite.configuration.exportSetting;

  NetSuiteCorporateCreditCardExpensesObject = NetSuiteCorporateCreditCardExpensesObject;

  NetSuiteReimbursableExpensesObject = NetsuiteReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  previewImagePaths = [
    {
      [NetsuiteReimbursableExpensesObject.EXPENSE_REPORT]: 'assets/illustrations/netsuite/expences-report.png',
      [NetsuiteReimbursableExpensesObject.BILL]: 'assets/illustrations/netsuite/bill.png',
      [NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY]: 'assets/illustrations/netsuite/journal-entry.png'
    },
    {
      [NetSuiteCorporateCreditCardExpensesObject.BILL]: 'assets/illustrations/netsuite/bill.png',
      [NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE]: 'assets/illustrations/netsuite/ccc.png',
      [NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: 'assets/illustrations/netsuite/journal-entry.png',
      [NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT]: 'assets/illustrations/netsuite/expences-report.png'
    }
  ];

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private exportSettingService: NetsuiteExportSettingsService,
    public helperService: HelperService,
    private netsuiteHelperServie: NetsuiteHelperService,
    private mappingService: MappingService,
    @Inject(Router) private router: Router,
    private toastService: IntegrationsToastService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }


  refreshDimensions() {
    this.netsuiteHelperServie.refreshNetsuiteDimensions().subscribe();
  }

  private reimbursableExportTypeWatcher(): void {
    this.exportSettingForm.controls.reimbursableExportType.valueChanges.subscribe((isreimbursableExportTypeSelected) => {
      if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) {
        this.exportSettingForm.controls.employeeFieldMapping.enable();
      } else if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT) {
        this.exportSettingForm.controls.employeeFieldMapping.patchValue(FyleField.EMPLOYEE);
        this.exportSettingForm.controls.employeeFieldMapping.disable();
      } else if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.BILL) {
        this.exportSettingForm.controls.employeeFieldMapping.patchValue(FyleField.VENDOR);
        this.exportSettingForm.controls.employeeFieldMapping.disable();
      }
    });
    this.exportSettingForm.controls.employeeFieldMapping.valueChanges.subscribe((isemployeeFieldMappingSelected) => {
      const [exportSettingValidatorRule, exportModuleRule] = NetSuiteExportSettingModel.getValidators();
      this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[0], NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
    });
  }

  private cccExportTypeWatcher(): void {
    this.exportSettingForm.controls.creditCardExportType.valueChanges.subscribe((isCCCExportTypeSelected) => {
      if (isCCCExportTypeSelected === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && !this.exportSettings?.configuration?.reimbursable_expenses_object) {
        this.exportSettingForm.controls.employeeFieldMapping.enable();
        this.exportSettingForm.controls.nameInJournalEntry.patchValue(NameInJournalEntry.EMPLOYEE);
      }
    });
    this.exportSettingForm.controls.nameInJournalEntry.valueChanges.subscribe((isNameInJournalEntrySelected) => {
        if (isNameInJournalEntrySelected === NameInJournalEntry.MERCHANT ) {
          HelperUtility.markControllerAsRequired(this.exportSettingForm, 'defaultCreditCardVendor');
        }
    });
  }

  private exportFieldsWatcher(): void {
    if (this.exportSettings?.configuration?.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY || (this.exportSettings?.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && !this.exportSettings?.configuration?.reimbursable_expenses_object)) {
      this.exportSettingForm.get('employeeFieldMapping')?.enable();
    } else {
      this.exportSettingForm.get('employeeFieldMapping')?.disable();
    }

    if (this.exportSettings?.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE) {
      this.exportSettingForm.controls.creditCardExportGroup.setValue(this.expenseGroupByOptions[0].value);
      this.exportSettingForm.controls.creditCardExportGroup.disable();
    }
    this.reimbursableExportTypeWatcher();
    this.cccExportTypeWatcher();
  }

  getEmployeeFieldMapping(employeeFieldMapping: FyleField | null, reimbursableExportType: string): string {
    let employeeFieldMappingLabel = '';
    if (employeeFieldMapping) {
      employeeFieldMappingLabel = employeeFieldMapping;
    } else if (reimbursableExportType === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) {
      employeeFieldMappingLabel = this.exportSettingForm.controls.employeeFieldMapping.value;
    } else {
      employeeFieldMappingLabel = reimbursableExportType === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT ? FyleField.EMPLOYEE : FyleField.VENDOR;
    }

    return new TitleCasePipe().transform(employeeFieldMappingLabel);
  }

  constructPayloadAndSave(data: ConfigurationWarningOut): void {
    if (data.hasAccepted) {
      this.isSaveInProgress = true;
      const exportSettingPayload = NetSuiteExportSettingModel.constructPayload(this.exportSettingForm);
      this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: NetSuiteExportSettingGet) => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(NetsuiteOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/netsuite/onboarding/import_settings`]);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
    }
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/netsuite/onboarding/connector`]);
  }

  save(): void {
    this.constructPayloadAndSave({hasAccepted: true, event: ConfigurationWarningEvent.NETSUITE_EXPORT_SETTINGS});
  }

  private updateCCCExpenseGroupingDateOptions(selectedValue: NetSuiteCorporateCreditCardExpensesObject): void {
    if (selectedValue === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE) {
      this.cccExpenseGroupingDateOptions = NetSuiteExportSettingModel.getAdditionalCreditCardExpenseGroupingDateOptions();
      this.exportSettingForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.exportSettingForm.controls.creditCardExportGroup.disable();
    } else {

      this.cccExpenseGroupingDateOptions = ExportSettingModel.constructGroupingDateOptions(this.exportSettingForm.value.creditCardExportGroup, NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions());
      this.helperService.clearValidatorAndResetValue(this.exportSettingForm, 'creditCardExportGroup');
      this.helperService.enableFormField(this.exportSettingForm, 'creditCardExportGroup');
    }
  }

  private setupCustomWatchers(): void {
    if (this.exportSettingForm.value.creditCardExportType && (this.exportSettingForm.value.creditCardExportType === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE)) {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.value.creditCardExportType);
    }

    this.exportSettingService.creditCardExportTypeChange.subscribe((selectedValue: NetSuiteCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.updateCCCExpenseGroupingDateOptions(selectedValue);
    });
  }

  private setupCustomDateOptionWatchers(): void {
    this.exportSettingForm.controls.reimbursableExportType?.valueChanges.subscribe(reimbursableExportType => {
      this.exportSettingForm.controls.reimbursableExportDate.reset();
    });

    this.exportSettingForm.controls.reimbursableExportGroup?.valueChanges.subscribe((reimbursableExportGroup) => {
      if (brandingConfig.brandId==='fyle') {
        this.reimbursableExpenseGroupingDateOptions = NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions();
        this.reimbursableExpenseGroupingDateOptions = ExportSettingModel.constructGroupingDateOptions(reimbursableExportGroup, this.reimbursableExpenseGroupingDateOptions);
      }
    });

    this.exportSettingForm.controls.creditCardExportType?.valueChanges.subscribe(creditCardExportType => {
      this.exportSettingForm.controls.creditCardExportDate.reset();
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.value.creditCardExportType);
    });

    this.exportSettingForm.controls.creditCardExportGroup?.valueChanges.subscribe((creditCardExportGroup) => {
      if (brandingConfig.brandId==='fyle' && this.exportSettingForm.value.creditCardExportType && this.exportSettingForm.value.creditCardExportType !== NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE) {
        this.cccExpenseGroupingDateOptions = NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions();
        this.cccExpenseGroupingDateOptions = ExportSettingModel.constructGroupingDateOptions(creditCardExportGroup, this.cccExpenseGroupingDateOptions);
      }
    });
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['VENDOR', 'ACCOUNTS_PAYABLE', 'BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT'];

    forkJoin({
      exportSetting: this.exportSettingService.getExportSettings(),
      destinationAttributes: this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v2', 'netsuite')
    }).subscribe(({exportSetting, destinationAttributes}) => {
      this.exportSettings = exportSetting;

      this.creditCardVendors =  destinationAttributes.VENDOR.map((option: DestinationAttribute) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));
      this.accountsPayables = destinationAttributes.ACCOUNTS_PAYABLE.map((option: DestinationAttribute) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));
      this.bankAccounts =  destinationAttributes.BANK_ACCOUNT.map((option: DestinationAttribute) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));
      this.cccAccounts =  destinationAttributes.CREDIT_CARD_ACCOUNT.map((option: DestinationAttribute) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));

      this.reimbursableExportTypes = NetSuiteExportSettingModel.getReimbursableExportTypeOptions();
      this.showNameInJournalOption = this.exportSettings.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.exportSettingForm = NetSuiteExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);
      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);

      const [exportSettingValidatorRule, exportModuleRule] = NetSuiteExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      if (this.exportSettings.configuration && this.exportSettings.configuration.reimbursable_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[0], this.exportSettings.configuration.reimbursable_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.configuration.reimbursable_expenses_object, exportSettingValidatorRule.reimbursableExpense, this.exportSettingForm);
      }

      if (this.exportSettings.configuration && this.exportSettings.configuration.corporate_credit_card_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[1], this.exportSettings.configuration.corporate_credit_card_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.configuration.corporate_credit_card_expenses_object, exportSettingValidatorRule.creditCardExpense, this.exportSettingForm);
      }

      this.exportSettingService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      this.exportFieldsWatcher();
      this.setupCustomWatchers();
      this.setupCustomDateOptionWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }
}

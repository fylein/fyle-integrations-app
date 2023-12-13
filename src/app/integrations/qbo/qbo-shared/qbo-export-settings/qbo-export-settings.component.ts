import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, AutoMapEmployeeOptions, ConfigurationCta, EmployeeFieldMapping, ExpenseGroupingFieldOption, QBOCorporateCreditCardExpensesObject, QBOReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { QBOExportSettingGet, QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';

@Component({
  selector: 'app-qbo-export-settings',
  templateUrl: './qbo-export-settings.component.html',
  styleUrls: ['./qbo-export-settings.component.scss']
})
export class QboExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBO.EXPORT_SETTING;

  brandingConfig = brandingConfig;

  isOnboarding: boolean;

  windowReference: Window;

  exportSettings: QBOExportSettingGet;

  employeeFieldMapping: EmployeeFieldMapping;

  bankAccounts: DestinationAttribute[];

  cccAccounts: DestinationAttribute[];

  accountsPayables: DestinationAttribute[];

  vendors: DestinationAttribute[];

  expenseAccounts: DestinationAttribute[];

  isImportItemsEnabled: boolean;

  reimbursableExportTypes: SelectFormOption[];

  creditCardExportTypes = QBOExportSettingModel.getCreditCardExportTypes();

  cccExpenseStateOptions = QBOExportSettingModel.getCCCExpenseStateOptions();

  expenseStateOptions = QBOExportSettingModel.getReimbursableExpenseStateOptions();

  expenseGroupByOptions = QBOExportSettingModel.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions = QBOExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();

  nameInJournalOptions = QBOExportSettingModel.getNameInJournalOptions();

  showNameInJournalOption: boolean;

  exportSettingForm: FormGroup;

  isSaveInProgress: boolean;

  appName: AppName = AppName.QBO;

  QBOCorporateCreditCardExpensesObject = QBOCorporateCreditCardExpensesObject;

  QBOReimbursableExpensesObject = QBOReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  previewImagePaths =[
    {
      [QBOReimbursableExpensesObject.EXPENSE]: 'assets/pngs/preview-screens/qbo-reimburse-expense.png',
      [QBOReimbursableExpensesObject.BILL]: 'assets/pngs/preview-screens/qbo-reimburse-bill.png',
      [QBOReimbursableExpensesObject.JOURNAL_ENTRY]: 'assets/pngs/preview-screens/qbo-reimburse-journal-entry.png',
      [QBOReimbursableExpensesObject.CHECK]: 'assets/pngs/preview-screens/qbo-reimburse-check.png'
    },
    {
      [QBOCorporateCreditCardExpensesObject.BILL]: 'assets/pngs/preview-screens/qbo-ccc-bill.png',
      [QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE]: 'assets/pngs/preview-screens/qbo-ccc-expense.png',
      [QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: 'assets/pngs/preview-screens/qbo-ccc-journal-entry.png',
      [QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE]: 'assets/pngs/preview-screens/qbo-ccc-debit-card.png'
    }
  ];

  ConfigurationCtaText = ConfigurationCta;

  constructor(
    private exportSettingService: QboExportSettingsService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  save(): void {
    // TODO, add warning as well
  }

  private setupCustomWatchers(): void {
    this.exportSettingService.creditCardExportTypeChange.subscribe((selectedValue: QBOCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      if ([QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE, QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE].includes(selectedValue)) {
        this.cccExpenseGroupingDateOptions = QBOExportSettingModel.getAdditionalCreditCardExpenseGroupingDateOptions();
        this.exportSettingForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
        this.exportSettingForm.controls.creditCardExportGroup.disable();
      } else {
        this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
        this.helperService.clearValidatorAndResetValue(this.exportSettingForm, 'creditCardExportGroup');
        this.helperService.enableFormField(this.exportSettingForm, 'creditCardExportGroup');
      }
    });
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];
    forkJoin({
      exportSetting: this.exportSettingService.getExportSettings(),
      destinationAttributes: this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v1', 'qbo'),
      workspaceGeneralSettings: this.workspaceService.getWorkspaceGeneralSettings()
    }).subscribe(({exportSetting, destinationAttributes, workspaceGeneralSettings}) => {
      this.exportSettings = exportSetting;
      this.employeeFieldMapping = workspaceGeneralSettings.employee_field_mapping;

      this.bankAccounts = destinationAttributes.BANK_ACCOUNT;
      this.cccAccounts = destinationAttributes.CREDIT_CARD_ACCOUNT;
      this.accountsPayables = destinationAttributes.ACCOUNTS_PAYABLE;
      this.vendors = destinationAttributes.VENDOR;
      this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);
      this.isImportItemsEnabled = workspaceGeneralSettings.import_items;

      this.reimbursableExportTypes = QBOExportSettingModel.getReimbursableExportTypeOptions(this.employeeFieldMapping);
      this.showNameInJournalOption = this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.exportSettingForm = QBOExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, this.employeeFieldMapping);
      this.helperService.addExportSettingFormValidator(this.exportSettingForm);

      const [exportSettingValidatorRule, exportModuleRule] = QBOExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);
      this.exportSettingService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      this.setupCustomWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}

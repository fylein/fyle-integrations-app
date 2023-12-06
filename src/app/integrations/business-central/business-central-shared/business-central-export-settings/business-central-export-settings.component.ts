import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { BusinessCentralExportSettingFormOption, BusinessCentralExportSettingGet, BusinessCentralExportSettingModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import { ExportModuleRule, ExportSettingValidatorRule } from 'src/app/core/models/common/export-settings.model';
import { AppName, BusinessCentralExportType, BusinessCentralField, ConfigurationCta, ExpenseGroupedBy, FyleField } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralExportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-export-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { BusinessCentralDestinationAttributes } from '/Users/fyle/integrations/fyle-integrations-app/src/app/core/models/business-central/db/business-central-destination-attribute.model';
import { FormGroup } from '@angular/forms';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { destinationAttributes, exportSettingsResponse } from '../business-central.fixture';

@Component({
  selector: 'app-business-central-export-settings',
  templateUrl: './business-central-export-settings.component.html',
  styleUrls: ['./business-central-export-settings.component.scss']
})
export class BusinessCentralExportSettingsComponent implements OnInit {

  isOnboarding: boolean;

  exportSettings: BusinessCentralExportSettingGet | null;

  exportSettingForm: FormGroup;

  creditCardAccountOptions: BusinessCentralDestinationAttributes[];

  bankOptions: BusinessCentralDestinationAttributes[];

  isLoading: boolean = true;

  previewImagePaths =[
    {
      'PURCHASE_INVOICE': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg',
      'JOURNAL_ENTRY': 'assets/illustrations/sageIntacct/Reimbursable Bill.jpg'
    },
    {
      'JOURNAL_ENTRY': 'assets/illustrations/sageIntacct/CCC Bill.jpg'
    }
  ];

  readonly brandingConfig = brandingConfig;

  redirectLink: string = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.EXPORT_SETTING;

  appName: string = AppName.BUSINESS_CENTRAL;

  BusinessCentralExportType = BusinessCentralExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: BusinessCentralExportSettingFormOption[] = this.exportSettingService.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions: BusinessCentralExportSettingFormOption[] = this.exportSettingService.getExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions: BusinessCentralExportSettingFormOption[] = this.exportSettingService.getExpenseGroupingDateOptions();

  reimbursableExpensesExportTypeOptions: BusinessCentralExportSettingFormOption[] = this.exportSettingService.getReimbursableExpensesExportTypeOptions();

  cccExpensesExportTypeOptions: BusinessCentralExportSettingFormOption[] = this.exportSettingService.getCCCExpensesExportTypeOptions();

  reimbursableExpenseState: BusinessCentralExportSettingFormOption[] = this.exportSettingService.getExpenseState();

  cccExpenseState: BusinessCentralExportSettingFormOption[] = this.exportSettingService.getExpenseState();

  sessionStartTime = new Date();

  isSaveInProgress: boolean;

  constructor(
    private exportSettingService: BusinessCentralExportSettingsService,
    private router: Router,
    private mappingService: MappingService,
    private helperService: BusinessCentralHelperService,
    public helper: HelperService
  ) { }

  save() {
    // TODO
  }

  getExportDate(options: BusinessCentralExportSettingFormOption[]): BusinessCentralExportSettingFormOption[]{
    if (this.exportSettingForm.value.reimbursableExpenseState === ExpenseGroupedBy.REPORT) {
      return options.slice(0, -1);
    }
    return options;
  }

  refreshDimensions(isRefresh: boolean): void{
    this.helperService.importAttributes(isRefresh);
  }

  addFormValidator(): void {
    this.exportSettingForm.controls.reimbursableExpense.setValidators(this.helper.exportSelectionValidator(this.exportSettingForm));
    this.exportSettingForm.controls.creditCardExpense.setValidators(this.helper.exportSelectionValidator(this.exportSettingForm));
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

        }
      },
      {
        'formController': 'cccExportType',
        'requiredValue': {
          'JOURNAL_ENTRY': ['defaultCreditCardCCCAccountName', 'defaultBankName']
        }
      }
    ];
    // ForkJoin([
    //   This.exportSettingService.getExportSettings().pipe(catchError(() => of(null))),
    //   This.mappingService.getGroupedDestinationAttributes([BusinessCentralField.ACCOUNT])
    // ]).subscribe(([exportSettingsResponse, destinationAttributes]) => {
      this.exportSettings = exportSettingsResponse;
      this.exportSettingForm = BusinessCentralExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);
      this.addFormValidator();
      this.helper.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);
      this.helper.setExportTypeValidatoresAndWatchers(exportModuleRule, this.exportSettingForm);
      this.creditCardAccountOptions = this.bankOptions = destinationAttributes;
      this.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

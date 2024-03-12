import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, EmployeeFieldMapping, XeroCorporateCreditCardExpensesObject, XeroReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { XeroExportSettingGet, XeroExportSettingModel } from 'src/app/core/models/xero/xero-configuration/xero-export-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { XeroExportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-export-settings.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';

@Component({
  selector: 'app-xero-export-settings',
  templateUrl: './xero-export-settings.component.html',
  styleUrls: ['./xero-export-settings.component.scss']
})
export class XeroExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.XERO.EXPORT_SETTING;

  brandingConfig = brandingConfig;

  isOnboarding: boolean;

  windowReference: Window;

  exportSettings:  XeroExportSettingGet;

  employeeFieldMapping: EmployeeFieldMapping;

  bankAccounts: DestinationAttribute[];

  cccAccounts: DefaultDestinationAttribute[];

  accountsPayables: DefaultDestinationAttribute[];

  vendors: DefaultDestinationAttribute[];

  expenseAccounts: DefaultDestinationAttribute[];

  isImportItemsEnabled: boolean;

  reimbursableExportTypes: SelectFormOption[] = XeroExportSettingModel.getReimbursableExportTypes();

  creditCardExportTypes =  XeroExportSettingModel.getCreditCardExportTypes();

  cccExpenseStateOptions: SelectFormOption[];

  expenseStateOptions: SelectFormOption[];

  expenseGroupByOptions =  XeroExportSettingModel.getExpenseGroupingOptions();

  reimbursableExpenseGroupingDateOptions =  XeroExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions = XeroExportSettingModel.getCCCExpenseGroupingDateOptions();

  autoMapEmployeeTypes = XeroExportSettingModel.getAutoMapEmployeeOptions();

  showNameInJournalOption: boolean;

  exportSettingForm: FormGroup;

  isSaveInProgress: boolean;

  isConfirmationDialogVisible: boolean;

  warningDialogText: string;

  appName: AppName = AppName.XERO;

  XeroCorporateCreditCardExpensesObject =  XeroCorporateCreditCardExpensesObject;

  XeroReimbursableExpensesObject =  XeroReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.configuration.exportSetting;

  is_simplify_report_closure_enabled: boolean = false;

  constructor(
    public helperService: HelperService,
    private exportSettingService: XeroExportSettingsService,
    private mappingService: MappingService,
    private xeroHelperService: XeroHelperService,
    private router : Router
  ) { }

  refreshDimensions() {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
  }

  save() {
    throw new Error('Method not implemented.');
  }

  constructPayloadAndSave($event: ConfigurationWarningOut) {
    throw new Error('Method not implemented.');
  }

  setupPage() {
    this.isOnboarding = this.router.url.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT'];

    forkJoin([
      this.exportSettingService.getExportSettings(),
      this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v1', 'xero')
    ]).subscribe(response => {
      this.exportSettings = response[0];
      this.bankAccounts = response[1].BANK_ACCOUNT;
      this.is_simplify_report_closure_enabled = (response[0].workspace_general_settings)?.is_simplify_report_closure_enabled;

      this.expenseStateOptions = XeroExportSettingModel.getReimbursableExpenseStateOptions(this.is_simplify_report_closure_enabled);
      this.cccExpenseStateOptions = XeroExportSettingModel.getCCCExpenseStateOptions(this.is_simplify_report_closure_enabled);
      this.exportSettingForm = XeroExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      const [exportSettingValidatorRule, exportModuleRule] = XeroExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      this.helperService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      this.isLoading = false;

    });
  }

  setupForm() {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

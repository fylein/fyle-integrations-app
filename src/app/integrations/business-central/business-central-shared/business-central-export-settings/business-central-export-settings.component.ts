import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { BusinessCentralExportSettingFormOption, BusinessCentralExportSettingGet, BusinessCentralExportSettingModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import { ExportModuleRule, ExportSettingValidatorRule } from 'src/app/core/models/common/export-settings.model';
import { AppName,  AutoMapEmployeeOptions, BusinessCentralExportType, BusinessCentralField, BusinessCentralOnboardingState, BusinessCentralUpdateEvent, ConfigurationCta, ExpenseGroupedBy, ExportDateType, FyleField, Page, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralExportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-export-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { BusinessCentralDestinationAttributes } from 'src/app/core/models/business-central/db/business-central-destination-attribute.model';
import { FormGroup } from '@angular/forms';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { destinationAttributes, exportSettingsResponse } from '../business-central.fixture';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

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

  vendorOptions: BusinessCentralDestinationAttributes[];

  isLoading: boolean = true;

  previewImagePaths = [
    {
      'PURCHASE_INVOICE': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg',
      'JOURNAL_ENTRY': 'assets/illustrations/sageIntacct/Reimbursable Bill.jpg'
    },
    {
      'JOURNAL_ENTRY': 'assets/illustrations/sageIntacct/CCC Bill.jpg'
    }
  ];

  previewExpenseGroupTypeImagePath = [
    {
      'EXPENSE': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg',
      'EXPENSE_REPOR': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg'
    },
    {
      'EXPENSE': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg',
      'EXPENSE_REPOR': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg'
    }
  ];

  readonly brandingConfig = brandingConfig;

  redirectLink: string = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.EXPORT_SETTING;

  appName: string = AppName.BUSINESS_CENTRAL;

  BusinessCentralExportType = BusinessCentralExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getCCCExpenseGroupingDateOptions();

  reimbursableExpensesExportTypeOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getReimbursableExpensesExportTypeOptions();

  cccExpensesExportTypeOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getCCCExpensesExportTypeOptions();

  reimbursableExpenseState: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getExpenseState();

  cccExpenseState: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getExpenseState();

  employeeFieldMappingOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getEntityOptions();

  employeeMapOptions: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getEmployeeMappingOptions();

  nameReferenceInCCC: BusinessCentralExportSettingFormOption[] = BusinessCentralExportSettingModel.getNameInJEOptions();

  sessionStartTime = new Date();

  isSaveInProgress: boolean;

  constructor(
    private exportSettingService: BusinessCentralExportSettingsService,
    private router: Router,
    private mappingService: MappingService,
    private helperService: HelperService,
    private businessCentralHelperService: BusinessCentralHelperService,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    public helper: HelperService
  ) { }

  private constructPayloadAndSave(): void {
    this.isSaveInProgress = true;
    const exportSettingPayload = BusinessCentralExportSettingModel.createExportSettingPayload(this.exportSettingForm);
    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((exportSettingResponse: BusinessCentralExportSettingGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.BUSINESS_CENTRAL, Page.EXPORT_SETTING_BUSINESS_CENTRAL, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === BusinessCentralOnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.BUSINESS_CENTRAL, BusinessCentralOnboardingState.EXPORT_SETTINGS, 2, exportSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.BUSINESS_CENTRAL,
          BusinessCentralUpdateEvent.ADVANCED_SETTINGS_BUSINESS_CENTRAL,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.exportSettings,
            newState: exportSettingResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(BusinessCentralOnboardingState.IMPORT_SETTINGS);
        this.router.navigate([`/integrations/business_central/onboarding/import_settings`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
  }

  save(): void {
    if (this.exportSettingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  getExportDate(options: BusinessCentralExportSettingFormOption[]): BusinessCentralExportSettingFormOption[]{
    if (this.exportSettingForm.value.reimbursableExportGroup === ExpenseGroupedBy.REPORT) {
      return options.filter(option => option.value === ExportDateType.LAST_SPENT_AT);
    }
    return options;
  }

  refreshDimensions(isRefresh: boolean): void{
    this.businessCentralHelperService.importAttributes(isRefresh);
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    const exportSettingValidatorRule: ExportSettingValidatorRule = {
      'reimbursableExpense': ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState', 'entityNamePreference', 'reimbursableEmployeeMapping'],
      'creditCardExpense': ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState', 'entityNamePreference']
    };

    const exportModuleRule: ExportModuleRule[] = [
      {
        'formController': 'reimbursableExportType',
        'requiredValue': {}
      },
      {
        'formController': 'cccExportType',
        'requiredValue': {
          'JOURNAL_ENTRY': ['defaultCreditCardCCCAccountName', 'defaultBankName', 'journalEntryNamePreference']
        }
      }
    ];
    forkJoin([
      this.exportSettingService.getExportSettings().pipe(catchError(() => of(null))),
      this.mappingService.getGroupedDestinationAttributes([BusinessCentralField.ACCOUNT, FyleField.VENDOR], 'v2')
    ]).subscribe(([exportSettingsResponse, destinationAttributes]) => {
      this.exportSettings = exportSettingsResponse;
      this.exportSettingForm = BusinessCentralExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, destinationAttributes);
      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      this.helper.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);
      this.helper.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);
      this.creditCardAccountOptions = destinationAttributes.ACCOUNT;
      this.bankOptions = destinationAttributes.ACCOUNT;
      this.vendorOptions = destinationAttributes.VENDOR;
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

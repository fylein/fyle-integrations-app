import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, FyleField, Page, Sage300ExportType, Sage300Field, Sage300OnboardingState, Sage300UpdateEvent, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';
import { ExportSettingModel, ExportModuleRule, Sage300ExportSettingFormOption, Sage300ExportSettingGet, ExportSettingValidatorRule } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';

@Component({
  selector: 'app-sage300-export-settings',
  templateUrl: './sage300-export-settings.component.html',
  styleUrls: ['./sage300-export-settings.component.scss']
})
export class Sage300ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isOnboarding: boolean;

  isSaveInProgress: boolean;

  exportSettings: Sage300ExportSettingGet | null;

  exportSettingForm: FormGroup;

  redirectLink: string = brandingKbArticles.onboardingArticles.SAGE300.EXPORT_SETTING;

  appName: string = AppName.SAGE300;

  Sage300ExportType = Sage300ExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseGroupingDateOptions();

  expensesExportTypeOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpensesExportTypeOptions();

  reimbursableExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseState();

  cccExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseState();

  sessionStartTime = new Date();

  vendorOptions: Sage300DestinationAttributes[];

  creditCardAccountOptions: Sage300DestinationAttributes[];

  debitCardAccountOptions: Sage300DestinationAttributes[];

  sage300Jobs: Sage300DestinationAttributes[];

  previewImagePaths =[
    {
      'PURCHASE_INVOICE': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg',
      'DIRECT_COST': 'assets/illustrations/sageIntacct/Reimbursable Bill.jpg'
    },
    {
      'PURCHASE_INVOICE': 'assets/illustrations/sageIntacct/CCC Expense Report.jpg',
      'DIRECT_COST': 'assets/illustrations/sageIntacct/CCC Bill.jpg'
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

  constructor(
    private exportSettingService: Sage300ExportSettingService,
    private router: Router,
    private helperService: HelperService,
    private sage300HelperService: Sage300HelperService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService,
    public helper: HelperService,
    private mappingService: MappingService
  ) { }

  refreshDimensions(isRefresh: boolean) {
    this.sage300HelperService.importAttributes(isRefresh);
  }

  private constructPayloadAndSave(): void {
    this.isSaveInProgress = true;
    const exportSettingPayload = ExportSettingModel.createExportSettingPayload(this.exportSettingForm);
    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((exportSettingResponse: Sage300ExportSettingGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');
      this.trackingService.trackTimeSpent(Page.EXPORT_SETTING_SAGE300, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === Sage300OnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(Sage300OnboardingState.EXPORT_SETTINGS, 2, exportSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          Sage300UpdateEvent.ADVANCED_SETTINGS_SAGE300,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.exportSettings,
            newState: exportSettingResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(Sage300OnboardingState.IMPORT_SETTINGS);
        this.router.navigate([`/integrations/sage300/onboarding/import_settings`]);
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
          'DIRECT_COST': ['defaultReimbursableCCCAccountName', 'defaultDebitCardAccountName', 'defaultJobName'],
          'PURCHASE_INVOICE': ['defaultVendorName']
        }
      },
      {
        'formController': 'cccExportType',
        'requiredValue': {
          'DIRECT_COST': ['defaultCreditCardCCCAccountName', 'defaultDebitCardAccountName', 'defaultJobName'],
          'PURCHASE_INVOICE': ['defaultVendorName']
        }
      }
    ];
    forkJoin([
      this.exportSettingService.getSage300ExportSettings().pipe(catchError(() => of(null))),
      this.mappingService.getGroupedDestinationAttributes([FyleField.VENDOR, Sage300Field.ACCOUNT, Sage300Field.JOB], 'v2')
    ]).subscribe(([exportSettingsResponse, destinationAttributes]) => {
      this.exportSettings = exportSettingsResponse;
      this.vendorOptions = destinationAttributes.VENDOR;
      this.creditCardAccountOptions = this.debitCardAccountOptions = destinationAttributes.ACCOUNT;
      this.sage300Jobs = destinationAttributes.JOB;
      this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, destinationAttributes );
      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      this.helper.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);
      this.helper.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

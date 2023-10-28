import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, ConfigurationCta, FyleField, Page, ProgressPhase, Sage300ExportType, Sage300Field, Sage300Link, Sage300OnboardingState, Sage300UpdateEvent, ToastSeverity, UpdateEvent } from 'src/app/core/models/enum/enum.model';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';
import { ExportSettingModel, Sage300ExportSettingFormOption, Sage300ExportSettingGet, ValidatorRule } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';
import { Sage300MappingService } from 'src/app/core/services/sage300/sage300-mapping/sage300-mapping.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-sage300-export-settings',
  templateUrl: './sage300-export-settings.component.html',
  styleUrls: ['./sage300-export-settings.component.scss']
})
export class Sage300ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isOnboarding: boolean;

  isSaveInProgress: boolean;

  exportSettings: Sage300ExportSettingGet | any;

  exportSettingForm: FormGroup;

  redirectLink: string = Sage300Link.EXPORT_SETTING;

  appName: string = AppName.SAGE300;

  Sage300ExportType = Sage300ExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupByOptions();

  expenseGroupingDateOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupingDateOptions();

  expensesExportTypeOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpensesExportTypeOptions();

  reimbursableExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseState();

  cccExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseState();

  validatorRule: ValidatorRule = {
    'reimbursableExpense': ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState'],
    'creditCardExpense': ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState']
  };

  vendorOptions: Sage300DestinationAttributes[];

  creditCardAccountOptions: Sage300DestinationAttributes[];

  sessionStartTime = new Date();

  constructor(
    private exportSettingService: Sage300ExportSettingService,
    private router: Router,
    private helperService: Sage300HelperService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) { }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  getExportType(exportType: string | null): string {
    return exportType ? new SnakeCaseToSpaceCasePipe().transform(new TitleCasePipe().transform(exportType)): 'expense';
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  exportTypeWatcher() {
    this.exportSettingForm.controls.reimbursableExportType.valueChanges.subscribe((value) => {
      if (value === Sage300ExportType.DIRECT_COST) {
        this.helper.markControllerAsRequired(this.exportSettingForm, 'defaultReimbursableCCCAccountName');
      } else {
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultReimbursableCCCAccountName');
      }
    });

    this.exportSettingForm.controls.cccExportType.valueChanges.subscribe((value) => {
      if (value === Sage300ExportType.DIRECT_COST) {
        this.helper.markControllerAsRequired(this.exportSettingForm, 'defaultCreditCardCCCAccountName');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultVendorName');
      } else if (value === Sage300ExportType.PURCHASE_INVOICE) {
        this.helper.markControllerAsRequired(this.exportSettingForm, 'defaultVendorName');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultCreditCardCCCAccountName');
      } else {
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultCreditCardCCCAccountName');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultVendorName');
      }
    });
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
            phase: this.getPhase(),
            oldState: this.exportSettings,
            newState: exportSettingResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(Sage300OnboardingState.IMPORT_SETTINGS);
        this.router.navigate([`/integrations/qbd/onboarding/field_mappings`]);
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
    this.exportSettingService.getSage300ExportSettings().subscribe((Sage300ExportSettingResponse: Sage300ExportSettingGet) => {
      this.exportSettingService.getDestinationAttributes([FyleField.VENDOR, Sage300Field.ACCOUNT]).subscribe((response: Sage300DestinationAttributes[]) => {
        this.exportSettings = Sage300ExportSettingResponse;
        this.exportSettings.credit_card_expense_grouped_by = ['expense_id'];
        this.exportSettings.reimbursable_expense_grouped_by = ['expense_id'];
        this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);
        this.exportSettingForm.controls.reimbursableExpense.setValidators(this.helper.exportSelectionValidator(this.exportSettingForm));
        this.exportSettingForm.controls.creditCardExpense.setValidators(this.helper.exportSelectionValidator(this.exportSettingForm));
        this.helper.setCustomValidatorsAndWatchers(this.validatorRule, this.exportSettingForm);
        this.exportTypeWatcher();
        this.vendorOptions = response;
        this.creditCardAccountOptions = response;
        this.isLoading = false;
      });
    }, (error) => {
      this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { SkipExportValidatorRule, ExpenseFilterPayload, SkipExportModel, ExpenseFilter, ExpenseFilterResponse, ConditionField, HourOption, skipExportValidator, AdvancedSettingsModel } from 'src/app/core/models/common/advanced-settings.model';
import { BusinessCentralAdvancedSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-advanced-settings.service';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { BusinessCentralAdvancedSettingsGet, BusinessCentralAdvancedSettingsModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-advanced-settings.model';
import { FormGroup } from '@angular/forms';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, BusinessCentralOnboardingState, BusinessCentralUpdateEvent, ConfigurationCta, CustomOperatorOption, Page, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-business-central-advanced-settings',
  templateUrl: './business-central-advanced-settings.component.html',
  styleUrls: ['./business-central-advanced-settings.component.scss']
})
export class BusinessCentralAdvancedSettingsComponent implements OnInit {

  isLoading: boolean = true;

  advancedSettingForm: FormGroup;

  skipExportForm: FormGroup;

  expenseFilters: ExpenseFilterResponse;

  conditionFieldOptions: ConditionField[];

  advancedSetting: BusinessCentralAdvancedSettingsGet | null;

  isSaveInProgress: boolean;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.ADVANCED_SETTING;

  isOnboarding: boolean;

  appName: AppName = AppName.BUSINESS_CENTRAL;

  hours: HourOption[] = [];

  isReimbursableExpense: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  defaultMemoOptions: string[] = ['employee_email', 'purpose', 'category', 'spent_on', 'report_number'];

  memoPreviewText: string;

  memoStructure: string[] = [];

  skipExportRedirectLink: string = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.SKIP_EXPORT;

  sessionStartTime: Date = new Date();

  readonly brandingConfig = brandingConfig;

  constructor(
    private advancedSettingsService: BusinessCentralAdvancedSettingsService,
    private helper: HelperService,
    private helperService: BusinessCentralHelperService,
    private skipExportService: SkipExportService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService,
    private router: Router
  ) { }

  getSkipExportValue() {
    if (this.advancedSettingForm.controls.skipExport) {
      if (this.skipExportForm.controls.condition1.value) {
        if (this.skipExportForm.controls.condition2.value) {
          return (this.skipExportForm.controls.value1.value || this.skipExportForm.controls.operator1.value === CustomOperatorOption.IsEmpty || this.skipExportForm.controls.operator1.value === CustomOperatorOption.IsNotEmpty) && (this.skipExportForm.controls.value2.value || this.skipExportForm.controls.operator2.value === CustomOperatorOption.IsEmpty || this.skipExportForm.controls.operator2.value === CustomOperatorOption.IsNotEmpty) ? true : false;
        }
        return this.skipExportForm.controls.value1.value || this.skipExportForm.controls.operator1.value === CustomOperatorOption.IsEmpty || this.skipExportForm.controls.operator1.value === CustomOperatorOption.IsNotEmpty ? true : false;
      }
    }
    return true;
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  deleteExpenseFilter(id: number) {
    this.skipExportService.deleteExpenseFilter(id).subscribe();
  }

  skipExportWatcher(): void {
    const formWatcher: skipExportValidator = {
      'isChanged': ['condition1', 'operator1', 'value1'],
      'isNotChanged': ['condition1', 'operator1', 'value1', 'condition2', 'operator2', 'value2', 'join_by']
    };
    this.helper.handleSkipExportFormInAdvancedSettingsUpdates(this.skipExportForm, formWatcher, this.advancedSettingForm);
  }

  onMultiSelectChange() {
    const memo = this.advancedSettingForm.controls.memoStructure.value;
    const changedMemo = AdvancedSettingsModel.formatMemoPreview(memo, this.defaultMemoOptions)[1];
    this.advancedSettingForm.controls.memoStructure.patchValue(changedMemo);
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingForm.value.memoStructure;
    const memo = AdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoOptions);
    this.memoPreviewText = memo[0];
    this.advancedSettingForm.controls.memoStructure.patchValue(memo[1]);
    this.advancedSettingForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoPreviewText = AdvancedSettingsModel.formatMemoPreview(memoChanges, this.defaultMemoOptions)[0];
    });
  }

  formWatchers() {
    this.skipExportWatcher();
    this.createMemoStructureWatcher();
    const skipExportFormWatcherFields: SkipExportValidatorRule = {
      condition1: ['operator1', 'value1'],
      condition2: ['operator2', 'value2'],
      operator1: ['value1'],
      operator2: ['value2']
    };
    this.helper.setConfigurationSettingValidatorsAndWatchers(skipExportFormWatcherFields, this.skipExportForm);
  }

  saveSkipExportFields(): void {
    if (!this.skipExportForm.valid) {
      return;
    }
    let valueField = this.skipExportForm.getRawValue();
    if (!valueField.condition1.field_name) {
      return;
    }
    valueField = SkipExportModel.constructSkipExportValue(valueField);
    valueField.rank = 1;
    const skipExportRank1: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
    const payload1 = SkipExportModel.constructSkipExportPayload(skipExportRank1, this.skipExportForm.value.value1);
    this.skipExportService.postExpenseFilter(payload1).subscribe((skipExport1: ExpenseFilter) => {
      if (valueField.condition2 && valueField.operator2) {
        valueField.rank = 2;
        const skipExportRank2: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
        const payload2 = SkipExportModel.constructSkipExportPayload(skipExportRank2, this.skipExportForm.value.value2);
        this.skipExportService.postExpenseFilter(payload2).subscribe((skipExport2: ExpenseFilter) => {});
      }
    });
  }

  constructPayloadAndSave(){
    this.isSaveInProgress = true;
    if (!this.advancedSettingForm.value.skipExport && this.expenseFilters.results.length > 0){
      this.expenseFilters.results.forEach((value) => {
        this.deleteExpenseFilter(value.id);
      });
    }
    if (this.advancedSettingForm.value.skipExport) {
      this.saveSkipExportFields();
    }
    const advancedSettingPayload = BusinessCentralAdvancedSettingsModel.createAdvancedSettingPayload(this.advancedSettingForm);
    this.advancedSettingsService.postAdvancedSettings(advancedSettingPayload).subscribe((advancedSettingsResponse: BusinessCentralAdvancedSettingsGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.BUSINESS_CENTRAL, Page.ADVANCED_SETTINGS_BUSINESS_CENTRAL, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === BusinessCentralOnboardingState.ADVANCED_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.BUSINESS_CENTRAL, BusinessCentralOnboardingState.ADVANCED_SETTINGS, 3, advancedSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.BUSINESS_CENTRAL,
          BusinessCentralUpdateEvent.ADVANCED_SETTINGS_BUSINESS_CENTRAL,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.advancedSetting,
            newState: advancedSettingsResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(BusinessCentralOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/business_central/onboarding/done`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
  }

  save(): void {
    if (this.advancedSettingForm.valid && this.skipExportForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private getSettingsAndSetupForm(): void {
    for (let i = 1; i <= 24; i++) {
      this.hours.push({ label: `${i}`, value: i });
    }
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingsService.getAdvancedSettings().pipe(catchError(() => of(null))),
      this.skipExportService.getExpenseFilter(),
      this.skipExportService.getExpenseFields()
    ]).subscribe(([businessCentralAdvancedSettingResponse, expenseFiltersGet, expenseFilterCondition]) => {
      this.advancedSetting = businessCentralAdvancedSettingResponse;
      this.expenseFilters = expenseFiltersGet;
      this.conditionFieldOptions = expenseFilterCondition;
      const isSkipExportEnabled = expenseFiltersGet.count > 0;
      this.advancedSettingForm = BusinessCentralAdvancedSettingsModel.mapAPIResponseToFormGroup(this.advancedSetting, isSkipExportEnabled);
      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);
      this.formWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

  navigateBack(): void {
    this.router.navigate([`/integrations/business_central/onboarding/import_settings`]);
  }

}

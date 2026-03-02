import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ConditionField, EmailOption, ExpenseFilterResponse, ExpenseFilter, HourOption, SkipExportModel, ExpenseFilterPayload, SkipExportValidatorRule } from 'src/app/core/models/common/advanced-settings.model';
import { AppName, ConfigurationCta, CustomOperatorOption, Page, Sage300OnboardingState, Sage300UpdateEvent, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { Sage300AdvancedSettingGet } from 'src/app/core/models/sage300/sage300-configuration/sage300-advanced-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { Sage300AdvancedSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-advanced-settings.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-core/sage300-helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { Router } from '@angular/router';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { environment } from 'src/environments/environment';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { TranslocoService } from '@jsverse/transloco';
import { AdvancedSettingsService } from 'src/app/core/services/common/advanced-settings.service';

@Component({
    selector: 'app-sage300-advanced-settings',
    templateUrl: './sage300-advanced-settings.component.html',
    styleUrls: ['./sage300-advanced-settings.component.scss'],
    standalone: false
})
export class Sage300AdvancedSettingsComponent implements OnInit {

  isLoading: boolean = true;

  advancedSettingForm: FormGroup;

  skipExportForm: FormGroup;

  expenseFilters: ExpenseFilterResponse;

  conditionFieldOptions: ConditionField[];

  advancedSetting: Sage300AdvancedSettingGet | null;

  adminEmails: EmailOption[];

  isSaveInProgress: boolean;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.SAGE300.ADVANCED_SETTING;

  isOnboarding: boolean;

  appName: string = AppName.SAGE300;

  hours: SelectFormOption[] = AdvancedSettingsService.getHoursOptions();

  isReimbursableExpense: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  defaultMemoOptions: string[] = ['employee_email', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  memoPreviewText: string;

  memoStructure: string[] = [];

  skipExportRedirectLink: string = brandingKbArticles.onboardingArticles.SAGE300.SKIP_EXPORT;

  sessionStartTime: Date = new Date();

  sageIntacctJobs: Sage300DestinationAttributes[];

  readonly AppName = AppName;

  readonly brandingConfig = brandingConfig;

  isSkipExportFormInvalid: boolean;

  readonly brandingStyle = brandingStyle;

  constructor(
    private advancedSettingsService: Sage300AdvancedSettingsService,
    private helper: HelperService,
    private helperService: Sage300HelperService,
    private skipExportService: SkipExportService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  invalidSkipExportForm($event: boolean) {
    this.isSkipExportFormInvalid = $event;
  }

  private formatMemoPreview(): void {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: 'john.doe@acme.com',
      employee_name: 'John Doe',
      card_number: '**** 3456',
      category: 'Meals and Entertainment',
      purpose: 'Client Meeting',
      merchant: 'Pizza Hut',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      expense_link: `${environment.fyle_app_url}/app/main/enterprise/view_expense/`
    };
    this.memoPreviewText = '';
    const memo: string[] = [];
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = this.defaultMemoOptions.indexOf(this.memoStructure[index]);
        memo[defaultIndex] = previewValues[field];
      }
    });
    memo.forEach((field, index) => {
      this.memoPreviewText += field;
      if (index + 1 !== memo.length) {
        this.memoPreviewText = this.memoPreviewText + ' - ';
      }
    });
  }

  getSkipExportValue() {
    if (this.advancedSettingForm.controls.skipExport) {
      if (this.skipExportForm.controls.condition1.value) {
        if (this.skipExportForm.controls.condition2.value) {
          return (this.skipExportForm.controls.value1.value || this.skipExportForm.controls.operator1.value === CustomOperatorOption.IsEmpty) && (this.skipExportForm.controls.value2.value || this.skipExportForm.controls.operator2.value === CustomOperatorOption.IsEmpty) ? true : false;
        }
        return this.skipExportForm.controls.value1.value || this.skipExportForm.controls.operator1.value === CustomOperatorOption.IsEmpty ? true : false;
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
    this.advancedSettingForm.controls.skipExport.valueChanges.subscribe((isSelected) => {
      if (isSelected) {
        const fields = ['condition1', 'operator1', 'value1'];
        this.helper.handleSkipExportFormUpdates(this.skipExportForm, fields, true);
      } else {
        const fields = ['condition1', 'operator1', 'value1', 'condition2', 'operator2', 'value2', 'join_by'];
        this.helper.handleSkipExportFormUpdates(this.skipExportForm, fields, false);
      }
    });
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingForm.get('memoStructure')?.value;
    this.formatMemoPreview();
    this.advancedSettingForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
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
    const payload1 = SkipExportModel.constructSkipExportPayload(skipExportRank1, this.skipExportForm.get('value1')?.value);
    this.skipExportService.postExpenseFilter(payload1).subscribe((skipExport1: ExpenseFilter) => {
      if (valueField.condition2 && valueField.operator2) {
        valueField.rank = 2;
        const skipExportRank2: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
        const payload2 = SkipExportModel.constructSkipExportPayload(skipExportRank2, this.skipExportForm.get('value2')?.value);
        this.skipExportService.postExpenseFilter(payload2).subscribe((skipExport2: ExpenseFilter) => {});
      }
    });
  }

  constructPayloadAndSave(){
    this.isSaveInProgress = true;
    if (!this.advancedSettingForm.get('skipExport')?.value && this.expenseFilters.results.length > 0){
      this.expenseFilters.results.forEach((value) => {
        this.deleteExpenseFilter(value.id);
      });
    }
    if (this.advancedSettingForm.get('skipExport')?.value) {
      this.saveSkipExportFields();
    }
    this.isSaveInProgress = true;
    const advancedSettingPayload = this.advancedSettingsService.createAdvancedSettingPayload(this.advancedSettingForm);
    this.advancedSettingsService.postAdvancedSettings(advancedSettingPayload).subscribe((advancedSettingsResponse: Sage300AdvancedSettingGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('sage300AdvancedSettings.advancedSettingsSavedSuccess'), undefined, this.isOnboarding);
      this.trackingService.trackTimeSpent(TrackingApp.SAGE300, Page.ADVANCED_SETTINGS_SAGE300, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === Sage300OnboardingState.ADVANCED_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.SAGE300, Sage300OnboardingState.ADVANCED_SETTINGS, 3, advancedSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.SAGE300,
          Sage300UpdateEvent.ADVANCED_SETTINGS_SAGE300,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.advancedSetting,
            newState: advancedSettingsResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(Sage300OnboardingState.COMPLETE);
        this.router.navigate([`/integrations/sage300/onboarding/done`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('sage300AdvancedSettings.errorSavingAdvancedSettings'));
      });
  }

  save(): void {
    if (this.advancedSettingForm.valid && this.skipExportForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingsService.getAdvancedSettings().pipe(catchError(() => of(null))),
      this.skipExportService.getExpenseFilter(),
      this.skipExportService.getExpenseFields()
    ]).subscribe(([sage300AdvancedSettingResponse, expenseFiltersGet, expenseFilterCondition]) => {
      this.advancedSetting = sage300AdvancedSettingResponse;
      this.expenseFilters = expenseFiltersGet;
      this.conditionFieldOptions = expenseFilterCondition;
      const isSkipExportEnabled = expenseFiltersGet.count > 0;
      this.advancedSettingForm = this.advancedSettingsService.mapAPIResponseToFormGroup(this.advancedSetting, isSkipExportEnabled, this.isOnboarding);
      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);
      this.formWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

  navigateBack(): void {
    this.router.navigate([`/integrations/sage300/onboarding/import_settings`]);
  }

}

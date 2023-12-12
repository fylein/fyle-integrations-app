import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { AdvancedSettingValidatorRule, ExpenseFilterPayload, SkipExportModel, ExpenseFilter, ExpenseFilterResponse, ConditionField, HourOption, skipExportValidator, AdvancedSettingsModel } from 'src/app/core/models/common/advanced-settings.model';
import { BusinessCentralAdvancedSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-advanced-settings.service';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { environment } from 'src/environments/environment';
import { BusinessCentralAdvancedSettingsGet, BusinessCentralAdvancedSettingsModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-advanced-settings.model';
import { FormGroup } from '@angular/forms';
import { brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta } from 'src/app/core/models/enum/enum.model';

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

  appName: string = AppName.BUSINESS_CENTRAL;

  hours: HourOption[] = [];

  isReimbursableExpense: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  defaultMemoOptions: string[] = ['employee_email', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  memoPreviewText: string;

  memoStructure: string[] = [];

  skipExportRedirectLink: string = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.SKIP_EXPORT;

  sessionStartTime: Date = new Date();

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

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  deleteExpenseFilter(rank: number) {
    this.skipExportService.deleteExpenseFilter(rank).subscribe();
  }

  skipExportWatcher(): void {
    const formWatcher: skipExportValidator = {
      'isChanged': ['condition1', 'operator1', 'value1'],
      'isNotChanged': ['condition1', 'operator1', 'value1', 'condition2', 'operator2', 'value2', 'join_by']
    };
    this.helper.handleSkipExportFormInAdvancedSettingsUpdates(this.skipExportForm, formWatcher, this.advancedSettingForm);
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingForm.value.memoStructure;
    this.memoPreviewText = AdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoOptions);
    this.advancedSettingForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.memoPreviewText = AdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoOptions);
    });
  }

  formWatchers() {
    this.skipExportWatcher();
    this.createMemoStructureWatcher();
    const skipExportFormWatcherFields: AdvancedSettingValidatorRule = {
      condition1: ['operator1', 'value1'],
      condition2: ['operator2', 'value2'],
      operator1: ['value1'],
      operator2: ['value2']
    };
    this.helper.setConfigurationSettingValidatorsAndWatchers(skipExportFormWatcherFields, this.skipExportForm);
  }

  save(): void {
    // TODO
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

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ConditionField, ExpenseFilterPayload, ExpenseFilterResponse, SkipExportModel, skipExportValidator, SkipExportValidatorRule } from 'src/app/core/models/common/advanced-settings.model';
import { EmailOption, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { AppName, AutoMapEmployeeOptions, ConfigurationCta, EmployeeFieldMapping, NameInJournalEntry, QBDCorporateCreditCardExpensesObject, QBDOnboardingState, QBDScheduleFrequency, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QbdDirectAdvancedSettingsGet, QbdDirectAdvancedSettingsModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { QbdDirectExportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QbdDirectAdvancedSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-advanced-settings',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './qbd-direct-advanced-settings.component.html',
  styleUrl: './qbd-direct-advanced-settings.component.scss'
})
export class QbdDirectAdvancedSettingsComponent implements OnInit {

  isOnboarding: any;

  isLoading: boolean = true;

  advancedSettingsForm: FormGroup;

  saveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  advancedSettings: QbdDirectAdvancedSettingsGet;

  QBDScheduleFrequency = QBDScheduleFrequency;

  hours: SelectFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1).toString(),
      value: day + 1
    };
  });

  defaultMemoFields: string[] = QbdDirectAdvancedSettingsModel.defaultMemoFields();

  defaultTopMemoOptions: string[] = QbdDirectAdvancedSettingsModel.defaultTopMemoOptions();

  adminEmails: EmailOption[];

  memoPreviewText: string;

  memoStructure: string[] = [];

  qbdDirectAdvancedSettings: QbdDirectAdvancedSettingsGet;

  employeeMapping: EmployeeFieldMapping;

  autoMapEmployee: boolean;

  AutoMapEmployeeOptions = AutoMapEmployeeOptions;

  private sessionStartTime = new Date();

  readonly brandingConfig = brandingConfig;

  readonly appName = AppName;

  readonly brandingContent = brandingContent.qbd_direct.configuration.advancedSettings;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  skipExportRedirectLink: string = brandingKbArticles.onboardingArticles.QBO.SKIP_EXPORT;

  qbdDirectExportSettings: QbdDirectExportSettingGet;

  expenseFilters: ExpenseFilterResponse;

  conditionFieldOptions: ConditionField[];

  skipExportForm: FormGroup;

  constructor(
    private advancedSettingsService: QbdDirectAdvancedSettingsService,
    private exportSettingsService: QbdDirectExportSettingsService,
    private skipExportService: SkipExportService,
    public helper: HelperService,
    private router: Router,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  private saveSkipExportFields(): void {
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
    this.skipExportService.postExpenseFilter(payload1).subscribe(() => {
      if (valueField.condition2 && valueField.operator2) {
        valueField.rank = 2;
        const skipExportRank2: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
        const payload2 = SkipExportModel.constructSkipExportPayload(skipExportRank2, this.skipExportForm.value.value2);
        this.skipExportService.postExpenseFilter(payload2).subscribe(() => {});
      }
    });
  }

  private saveSkipExport(): void {
    if (!this.advancedSettingsForm.value.skipExport && this.expenseFilters.results.length > 0){
      this.expenseFilters.results.forEach((value) => {
        this.deleteExpenseFilter(value.id);
      });
    }
    if (this.advancedSettingsForm.value.skipExport) {
      this.saveSkipExportFields();
    }
  }

  save() {
    this.saveInProgress = true;
    this.saveSkipExport();
    const advancedSettingPayload = QbdDirectAdvancedSettingsModel.constructPayload(this.advancedSettingsForm);
    this.advancedSettingsService.postQbdAdvancedSettings(advancedSettingPayload).subscribe((response: QbdDirectAdvancedSettingsGet) => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully');

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/qbd_direct/onboarding/done`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving advanced settings, please try again later');
    });
  }

  deleteExpenseFilter(id: number) {
    this.skipExportService.deleteExpenseFilter(id).subscribe();
  }

  isAutoCreateMerchantsAsVendorsFieldVisible(): boolean {
    return (this.qbdDirectExportSettings.credit_card_expense_export_type === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || this.qbdDirectExportSettings.credit_card_expense_export_type === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY || this.qbdDirectExportSettings.name_in_journal_entry === NameInJournalEntry.MERCHANT) && (!this.qbdDirectExportSettings.reimbursable_expense_export_type);
  }

  skipExportWatcher(): void {
    const skipExportFormWatcherFields: SkipExportValidatorRule = {
      condition1: ['operator1', 'value1'],
      condition2: ['operator2', 'value2'],
      operator1: ['value1'],
      operator2: ['value2']
    };
    this.helper.setConfigurationSettingValidatorsAndWatchers(skipExportFormWatcherFields, this.skipExportForm);

    const formWatcher: skipExportValidator = {
      'isChanged': ['condition1', 'operator1', 'value1'],
      'isNotChanged': ['condition1', 'operator1', 'value1', 'condition2', 'operator2', 'value2', 'join_by']
    };
    this.helper.handleSkipExportFormInAdvancedSettingsUpdates(this.skipExportForm, formWatcher, this.advancedSettingsForm);
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.value.expenseMemoStructure;
    this.memoPreviewText = QbdDirectAdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoFields)[0];
    this.advancedSettingsForm.controls.expenseMemoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.memoPreviewText = QbdDirectAdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoFields)[0];
    });
  }

  private scheduledWatcher() {
    if (this.advancedSettingsForm.controls.exportSchedule.value) {
        this.helper.markControllerAsRequired(this.advancedSettingsForm, 'email');
        this.helper.markControllerAsRequired(this.advancedSettingsForm, 'exportScheduleFrequency');
    }
    this.advancedSettingsForm.controls.exportSchedule.valueChanges.subscribe((isScheduledSelected: any) => {
      if (isScheduledSelected) {
          this.helper.markControllerAsRequired(this.advancedSettingsForm, 'email');
          this.helper.markControllerAsRequired(this.advancedSettingsForm, 'exportScheduleFrequency');
      } else {
          this.advancedSettingsForm.controls.exportScheduleFrequency.clearValidators();
          this.advancedSettingsForm.controls.exportScheduleFrequency.setValue(1);
          this.advancedSettingsForm.controls.email.clearValidators();
          this.advancedSettingsForm.controls.email.setValue([]);
      }
    });
  }

  private advancedSettingsFormWatcher(): void {
    this.createMemoStructureWatcher();
    this.scheduledWatcher();
    this.skipExportWatcher();
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingsService.getQbdAdvancedSettings(),
      this.exportSettingsService.getQbdExportSettings(),
      this.skipExportService.getExpenseFilter(),
      this.skipExportService.getExpenseFields('v1'),
      this.orgService.getAdditionalEmails()
    ]).subscribe(([qbdDirectAdvancedSettings, qbdDirectExportSettings, expenseFiltersGet, expenseFilterCondition, adminEmail]) => {

      this.qbdDirectAdvancedSettings = qbdDirectAdvancedSettings;

      this.qbdDirectExportSettings = qbdDirectExportSettings;

      this.employeeMapping = qbdDirectExportSettings.employee_field_mapping;

      this.autoMapEmployee = qbdDirectExportSettings.auto_map_employees;

      this.adminEmails = adminEmail;

      this.expenseFilters = expenseFiltersGet;

      this.conditionFieldOptions = expenseFilterCondition;

      const isSkipExportEnabled = expenseFiltersGet.count > 0;

      this.advancedSettingsForm = QbdDirectAdvancedSettingsModel.mapAPIResponseToFormGroup(qbdDirectAdvancedSettings, isSkipExportEnabled);

      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);

      this.advancedSettingsFormWatcher();

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}

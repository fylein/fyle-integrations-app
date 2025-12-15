import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { catchError, forkJoin, of } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ConditionField, ExpenseFilterPayload, ExpenseFilterResponse, SkipExportModel, skipExportValidator, SkipExportValidatorRule } from 'src/app/core/models/common/advanced-settings.model';
import { EmailOption, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { AppName, AutoMapEmployeeOptions, ConfigurationCta, EmployeeFieldMapping, IntacctUpdateEvent, NameInJournalEntry, Page, ProgressPhase, QBDCorporateCreditCardExpensesObject, QbdDirectOnboardingState, QbdDirectUpdateEvent, QBDOnboardingState, QBDScheduleFrequency, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { QbdDirectAdvancedSettingsGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { QbdDirectExportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { AdvancedSettingsService } from 'src/app/core/services/common/advanced-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QbdDirectAdvancedSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { QbdDirectImportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.service';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-qbd-direct-advanced-settings',
    imports: [CommonModule, SharedModule, TranslocoModule],
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

  hours: SelectFormOption[] = AdvancedSettingsService.getHoursOptions();

  defaultMemoFields: string[] = QbdDirectAdvancedSettingsService.defaultMemoFields();

  defaultTopMemoOptions: string[] = QbdDirectAdvancedSettingsService.defaultTopMemoOptions();

  adminEmails: EmailOption[];

  memoPreviewText: string;

  memoStructure: string[] = [];

  qbdDirectAdvancedSettings: QbdDirectAdvancedSettingsGet | null;

  employeeMapping: EmployeeFieldMapping;

  redirectLink = brandingKbArticles.onboardingArticles.QBD_DIRECT.ADVANCED_SETTING;

  AutoMapEmployeeOptions = AutoMapEmployeeOptions;

  private sessionStartTime = new Date();

  readonly brandingConfig = brandingConfig;

  readonly appName = AppName;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  qbdDirectExportSettings: QbdDirectExportSettingGet;

  expenseFilters: ExpenseFilterResponse;

  conditionFieldOptions: ConditionField[];

  skipExportForm: FormGroup;

  isReimbursableExportTypePresent: boolean;

  showAutoCreateMerchantsAsVendorsField: boolean;

  isImportVendorAsMerchantPresent: boolean;

  topMemoPreviewText: string;

  readonly brandingStyle = brandingStyle;

  constructor(
    private advancedSettingsService: QbdDirectAdvancedSettingsService,
    private exportSettingsService: QbdDirectExportSettingsService,
    private importSettingsService: QbdDirectImportSettingsService,
    private skipExportService: SkipExportService,
    public helper: HelperService,
    private router: Router,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private qbdDirectHelperService: QbdDirectHelperService,
    private trackingService: TrackingService,
    private translocoService: TranslocoService
  ) { }

  private saveSkipExportFields(): void {
    if (!this.skipExportForm.valid) {
      return;
    }
    let valueField = this.skipExportForm.getRawValue();
    if (!valueField.condition1.field_name || !valueField.value1) {
      return;
    }
    valueField = SkipExportModel.constructSkipExportValue(valueField);
    valueField.rank = 1;
    const skipExportRank1: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
    const payload1 = SkipExportModel.constructSkipExportPayload(skipExportRank1, this.skipExportForm.value.value1);
    this.skipExportService.postExpenseFilter(payload1).subscribe(() => {
      if (valueField.condition2 && valueField.operator2 && valueField.value2) {
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

  navigateToPreviousStep() {
    this.router.navigate([`/integrations/qbd_direct/onboarding/import_settings`]);
  }

  refreshDimensions() {
    this.qbdDirectHelperService.importAttributes(true);
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  save() {
    this.saveInProgress = true;
    this.saveSkipExport();
    const advancedSettingPayload = QbdDirectAdvancedSettingsService.constructPayload(this.advancedSettingsForm, this.adminEmails);
    this.advancedSettingsService.postQbdAdvancedSettings(advancedSettingPayload).subscribe((response: QbdDirectAdvancedSettingsGet) => {

      this.trackingService.trackTimeSpent(TrackingApp.QBD_DIRECT, Page.ADVANCED_SETTINGS_QBD_DIRECT, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === QbdDirectOnboardingState.ADVANCED_SETTINGS) {
        this.trackingService.integrationsOnboardingCompletion(TrackingApp.QBD_DIRECT, QbdDirectOnboardingState.ADVANCED_SETTINGS, 5, advancedSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.QBD_DIRECT,
          QbdDirectUpdateEvent.ADVANCED_SETTINGS_QBD_DIRECT,
          {
            phase: this.getPhase(),
            oldState: this.advancedSettings,
            newState: response
          }
        );
      }

      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qbdDirectAdvancedSettings.advancedSettingsSavedSuccess'), undefined, this.isOnboarding);

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/qbd_direct/onboarding/done`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectAdvancedSettings.errorSavingAdvancedSettings'));
    });
  }

  deleteExpenseFilter(id: number) {
    this.skipExportService.deleteExpenseFilter(id).subscribe();
  }

  isAutoCreateMerchantsAsVendorsFieldVisible(): boolean {
    return (this.qbdDirectExportSettings.credit_card_expense_export_type === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || (this.qbdDirectExportSettings.credit_card_expense_export_type === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.qbdDirectExportSettings.name_in_journal_entry === NameInJournalEntry.MERCHANT)) && this.isImportVendorAsMerchantPresent;
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
    this.memoPreviewText = QbdDirectAdvancedSettingsService.formatMemoPreview(this.memoStructure, this.defaultMemoFields)[0];
    this.advancedSettingsForm.controls.expenseMemoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.memoPreviewText = QbdDirectAdvancedSettingsService.formatMemoPreview(this.memoStructure, this.defaultMemoFields)[0];
    });
  }

  private createTopMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.value.topMemoStructure;
    this.topMemoPreviewText = QbdDirectAdvancedSettingsService.formatMemoPreview(this.memoStructure, this.defaultTopMemoOptions)[0];
    this.advancedSettingsForm.controls.topMemoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.topMemoPreviewText = QbdDirectAdvancedSettingsService.formatMemoPreview(this.memoStructure, this.defaultTopMemoOptions)[0];
    });
  }

  private scheduledWatcher() {
    if (this.advancedSettingsForm.controls.exportSchedule.value) {
      this.helper.markControllerAsRequired(this.advancedSettingsForm, 'exportScheduleFrequency');
    }
    this.advancedSettingsForm.controls.exportSchedule.valueChanges.subscribe((isScheduledSelected: any) => {
      if (isScheduledSelected) {
        this.helper.markControllerAsRequired(this.advancedSettingsForm, 'exportScheduleFrequency');
      } else {
        this.advancedSettingsForm.controls.exportScheduleFrequency.clearValidators();
        this.advancedSettingsForm.controls.exportScheduleFrequency.setValue(1);
      }
    });
  }

  private advancedSettingsFormWatcher(): void {
    this.createMemoStructureWatcher();
    this.scheduledWatcher();
    this.skipExportWatcher();
    this.createTopMemoStructureWatcher();
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingsService.getQbdAdvancedSettings().pipe(catchError(() => of(null))),
      this.exportSettingsService.getQbdExportSettings(),
      this.skipExportService.getExpenseFilter(),
      this.skipExportService.getExpenseFields(),
      this.orgService.getAdditionalEmails(),
      this.importSettingsService.getImportSettings()
    ]).subscribe(([qbdDirectAdvancedSettings, qbdDirectExportSettings, expenseFiltersGet, expenseFilterCondition, adminEmail, qbdDirectImportSettingSettings]) => {

      this.qbdDirectAdvancedSettings = qbdDirectAdvancedSettings;

      this.qbdDirectExportSettings = qbdDirectExportSettings;

      this.employeeMapping = qbdDirectExportSettings.employee_field_mapping;

      this.isImportVendorAsMerchantPresent = !qbdDirectImportSettingSettings.import_settings.import_vendor_as_merchant;

      this.isReimbursableExportTypePresent = qbdDirectExportSettings.reimbursable_expense_export_type !== null ? true : false;

      this.adminEmails = adminEmail;

      this.expenseFilters = expenseFiltersGet;

      this.conditionFieldOptions = expenseFilterCondition;

      const isSkipExportEnabled = expenseFiltersGet.count > 0;

      this.advancedSettingsForm = this.advancedSettingsService.mapAPIResponseToFormGroup(qbdDirectAdvancedSettings, isSkipExportEnabled, this.isOnboarding);

      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);

      this.advancedSettingsFormWatcher();

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { EmailOption, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { AppName, AutoMapEmployeeOptions, ConfigurationCta, EmployeeFieldMapping, QBDCorporateCreditCardExpensesObject, QBDOnboardingState, QBDScheduleFrequency, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QbdDirectAdvancedSettingsGet, QbdDirectAdvancedSettingsModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { QbdDirectExportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
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

  autoMapEmployee: AutoMapEmployeeOptions;

  AutoMapEmployeeOptions = AutoMapEmployeeOptions;

  private sessionStartTime = new Date();

  readonly brandingConfig = brandingConfig;

  readonly appName = AppName;

  readonly brandingContent = brandingContent.qbd_direct.configuration.advancedSettings;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  qbdDirectExportSettings: QbdDirectExportSettingGet;

  constructor(
    private advancedSettingsService: QbdDirectAdvancedSettingsService,
    private exportSettingsService: QbdDirectExportSettingsService,
    public helper: HelperService,
    private router: Router,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  save() {
    this.saveInProgress = true;
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

  isAutoCreateEmployeeVisible(): any {
    return this.autoMapEmployee === AutoMapEmployeeOptions.EMPLOYEE_CODE;
  }

  isAutoCreateMerchantsAsVendorsFieldVisible(): boolean {
    return (this.qbdDirectExportSettings.credit_card_expense_export_type === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || this.qbdDirectExportSettings.credit_card_expense_export_type === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY) && (!this.qbdDirectExportSettings.reimbursable_expense_export_type);
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
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingsService.getQbdAdvancedSettings(),
      this.exportSettingsService.getQbdExportSettings(),
      this.orgService.getAdditionalEmails()
    ]).subscribe(([qbdDirectAdvancedSettings, qbdDirectExportSettings, adminEmail]) => {

      this.qbdDirectAdvancedSettings = qbdDirectAdvancedSettings;

      this.qbdDirectExportSettings = qbdDirectExportSettings;

      this.employeeMapping = qbdDirectExportSettings.employee_field_mapping;

      this.autoMapEmployee = qbdDirectExportSettings.auto_map_employees;

      this.adminEmails = adminEmail;

      this.advancedSettingsForm = QbdDirectAdvancedSettingsModel.mapAPIResponseToFormGroup(qbdDirectAdvancedSettings);

      this.advancedSettingsFormWatcher();

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}

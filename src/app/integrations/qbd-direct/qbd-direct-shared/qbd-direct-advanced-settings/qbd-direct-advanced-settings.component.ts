import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent } from 'src/app/branding/branding-config';
import { EmailOption, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { AppName, ConfigurationCta, QBDOnboardingState, QBDScheduleFrequency, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QbdDirectAdvancedSettingsGet, QbdDirectAdvancedSettingsModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QbdAdvancedSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-advanced-setting.service';
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

  frequencyOption: SelectFormOption[] = QbdDirectAdvancedSettingsModel.frequencyOption();

  defaultMemoFields: string[] = QbdDirectAdvancedSettingsModel.defaultMemoFields();

  defaultTopMemoOptions: string[] = QbdDirectAdvancedSettingsModel.defaultTopMemoOptions();

  adminEmails: EmailOption[];

  weeklyOptions: string[] = QbdDirectAdvancedSettingsModel.weeklyOptions();

  frequencyIntervals: SelectFormOption[] = QbdDirectAdvancedSettingsModel.frequencyIntervals();

  memoPreviewText: string;

  memoStructure: string[] = [];

  private sessionStartTime = new Date();

  readonly brandingConfig = brandingConfig;

  readonly appName = AppName;

  readonly brandingContent = brandingContent.qbd_direct.configuration.advancedSettings;

  qbdDirectAdvancedSettings: QbdDirectAdvancedSettingsGet;

  constructor(
    private advancedSettingsService: QbdAdvancedSettingService,
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

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.value.expenseMemoStructure;
    this.memoPreviewText = QbdDirectAdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoFields)[0];
    this.advancedSettingsForm.controls.expenseMemoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.memoPreviewText = QbdDirectAdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoFields)[0];
    });
  }

  private frequencyWatcher() {
    this.advancedSettingsForm.controls.frequency.valueChanges.subscribe((frequency) => {
      if (frequency=== this.frequencyOption[1].value) {
        this.helper.markControllerAsRequired(this.advancedSettingsForm, 'dayOfWeek');
        this.helper.clearValidatorAndResetValue(this.advancedSettingsForm, 'dayOfMonth');
      } else if (frequency === this.frequencyOption[2].value) {
        this.helper.clearValidatorAndResetValue(this.advancedSettingsForm, 'dayOfWeek');
        this.helper.markControllerAsRequired(this.advancedSettingsForm, 'dayOfMonth');
      }
    });
  }

  private scheduledWatcher() {
    if (this.advancedSettingsForm.controls.exportSchedule.value) {
        this.helper.markControllerAsRequired(this.advancedSettingsForm, 'email');
        this.helper.markControllerAsRequired(this.advancedSettingsForm, 'frequency');
    }
    this.advancedSettingsForm.controls.exportSchedule.valueChanges.subscribe((isScheduledSelected: any) => {
      if (isScheduledSelected) {
          this.helper.markControllerAsRequired(this.advancedSettingsForm, 'email');
          this.helper.markControllerAsRequired(this.advancedSettingsForm, 'frequency');
      } else {
          this.helper.clearValidatorAndResetValue(this.advancedSettingsForm, 'frequency');
          this.advancedSettingsForm.controls.email.clearValidators();
          this.advancedSettingsForm.controls.email.setValue([]);
      }
    });
  }

  private advancedSettingsFormWatcher(): void {
    this.createMemoStructureWatcher();
    this.frequencyWatcher();
    this.scheduledWatcher();
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingsService.getQbdAdvancedSettings(),
      this.orgService.getAdditionalEmails()
    ]).subscribe(([qbdDirectAdvancedSettings, adminEmail]) => {

      this.qbdDirectAdvancedSettings = qbdDirectAdvancedSettings;

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

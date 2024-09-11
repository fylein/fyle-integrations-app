import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { EmailOption, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { AppName, ConfigurationCta, QBDScheduleFrequency } from 'src/app/core/models/enum/enum.model';
import { QbdDirectAdvancedSettingsGet, QbdDirectAdvancedSettingsModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QbdAdvancedSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-advanced-setting.service';

@Component({
  selector: 'app-qbd-direct-advanced-settings',
  standalone: true,
  imports: [],
  templateUrl: './qbd-direct-advanced-settings.component.html',
  styleUrl: './qbd-direct-advanced-settings.component.scss'
})
export class QbdDirectAdvancedSettingsComponent implements OnInit {

  isOnboarding: any;

  isLoading: boolean;

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

  readonly AppName = AppName;

  qbdDirectAdvancedSettings: import("/Users/fyle/integrations/fyle-integrations-app/src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model").QBDAdvancedSettingsGet;

  constructor(
    private advancedSettingsService: QbdAdvancedSettingService,
    public helper: HelperService,
    private router: Router,
    private orgService: OrgService
    // Private toastService: IntegrationsToastService,
    // Private workspaceService: WorkspaceService
  ) { }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.value.expenseMemoStructure;
    QbdDirectAdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoFields);
    this.advancedSettingsForm.controls.expenseMemoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      QbdDirectAdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoFields);
    });
  }

  private frequencyWatcher() {
    this.advancedSettingsForm.controls.frequency.valueChanges.subscribe((frequency) => {
      if (frequency=== this.frequencyOption[1].value) {
        this.advancedSettingsForm.controls.dayOfWeek.setValidators(Validators.required);
        this.advancedSettingsForm.controls.dayOfMonth.clearValidators();
      } else if (frequency === this.frequencyOption[2].value) {
        this.advancedSettingsForm.controls.dayOfWeek.clearValidators();
        this.advancedSettingsForm.controls.dayOfMonth.setValidators(Validators.required);
      }
    });
  }

  private scheduledWatcher() {
    if (this.advancedSettingsForm.controls.exportSchedule.value) {
      this.advancedSettingsForm.controls.email.setValidators(Validators.required);
      this.advancedSettingsForm.controls.frequency.setValidators(Validators.required);
    }
    this.advancedSettingsForm.controls.exportSchedule.valueChanges.subscribe((isScheduledSelected: any) => {
      if (isScheduledSelected) {
        this.advancedSettingsForm.controls.email.setValidators(Validators.required);
        this.advancedSettingsForm.controls.frequency.setValidators(Validators.required);
      } else {
        this.advancedSettingsForm.controls.frequency.clearValidators();
        this.advancedSettingsForm.controls.frequency.setValue(null);
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

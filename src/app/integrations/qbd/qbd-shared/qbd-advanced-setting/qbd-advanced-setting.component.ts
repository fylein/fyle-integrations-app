import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClickEvent, Page, ConfigurationCta, QBDOnboardingState, ProgressPhase, QBDScheduleFrequency, ToastSeverity, UpdateEvent, TrackingApp, AppName } from 'src/app/core/models/enum/enum.model';
import { QBDAdvancedSettingModel, QBDAdvancedSettingsGet, QBDEmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QbdAdvancedSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-advanced-setting.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { environment } from 'src/environments/environment';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-advanced-setting',
  templateUrl: './qbd-advanced-setting.component.html',
  styleUrls: ['./qbd-advanced-setting.component.scss']
})
export class QbdAdvancedSettingComponent implements OnInit {
  isOnboarding: any;

  isLoading: boolean;

  advancedSettingsForm: FormGroup;

  saveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  advancedSettings: QBDAdvancedSettingsGet;

  QBDScheduleFrequency = QBDScheduleFrequency;

  frequencyOption: QBDExportSettingFormOption[];

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  defaultTopMemoOptions: string[] = ["employee_email", "employee_name", "purpose", "merchant"];

  adminEmails: QBDEmailOptions[];

  weeklyOptions: string[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  frequencyIntervals:QBDExportSettingFormOption[];

  memoPreviewText: string;

  memoStructure: string[] = [];

  private sessionStartTime = new Date();

  readonly brandingConfig = brandingConfig;

  readonly AppName = AppName;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private advancedSettingService: QbdAdvancedSettingService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private workspaceService: QbdWorkspaceService,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private translocoService: TranslocoService
  ) { }

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
      expense_link: `${environment.fyle_app_url}/app/main/#/enterprise/view_expense/`
    };
    this.memoPreviewText = '';
    const memo: string[] = [];
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = this.defaultMemoFields.indexOf(this.memoStructure[index]);
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

  private getDayOfMonthLabel(day: number): string {
    let key: string;
    if (day === 1) {
      key = 'qbdAdvancedSetting.dayOfMonthFirst';
    } else if (day === 2) {
      key = 'qbdAdvancedSetting.dayOfMonthSecond';
    } else if (day === 3) {
      key = 'qbdAdvancedSetting.dayOfMonthThird';
    } else {
      key = 'qbdAdvancedSetting.dayOfMonthNth';
    }
    return this.translocoService.translate(key, { day: day });
  }

  private initialTime(): string[] {
    const inputTime = this.advancedSettings?.time_of_day ? this.advancedSettings.time_of_day: "12:00:00";
    const outputTime = new Date(`01/01/2000 ${inputTime} GMT`).toLocaleString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    const time = outputTime.split(" ");
    const Time = time[0][0] > '1' && time[0][1] === ':' ? '0'+time[0] : time[0];
    time[0] = Time.slice(0, -3);
    return time;
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.get('expenseMemoStructure')?.value;
    this.formatMemoPreview();
    this.advancedSettingsForm.controls.expenseMemoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
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
    this.advancedSettingsForm.controls.exportSchedule.valueChanges.subscribe((isScheduledSelected) => {
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

  getAdminEmails() {
    this.isLoading= true;
    this.orgService.getAdditionalEmails().subscribe((emailResponse: QBDEmailOptions[]) => {
      this.adminEmails = emailResponse;
      this.frequencyOption = [
        {
          value: QBDScheduleFrequency.DAILY,
          label: this.translocoService.translate('qbdAdvancedSetting.daily')
        },
        {
          value: QBDScheduleFrequency.WEEKLY,
          label: this.translocoService.translate('qbdAdvancedSetting.weekly')
        },
        {
          value: QBDScheduleFrequency.MONTHLY,
          label: this.translocoService.translate('qbdAdvancedSetting.monthly')
        }
      ];
      this.frequencyIntervals = [...Array(30).keys()].map(day => {
        return {
          label: this.getDayOfMonthLabel(day + 1),
          value: (day + 1).toString()
        };
      });
      this.getSettingsAndSetupForm();
    });
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.advancedSettingService.getQbdAdvancedSettings().subscribe((advancedSettingResponse : QBDAdvancedSettingsGet) => {
      this.advancedSettings = advancedSettingResponse;
      const resultTime = this.initialTime();
      this.advancedSettingsForm = this.formBuilder.group({
        expenseMemoStructure: [this.advancedSettings?.expense_memo_structure && this.advancedSettings?.expense_memo_structure.length > 0 ? this.advancedSettings?.expense_memo_structure : this.defaultMemoFields, Validators.required],
          topMemoStructure: [this.advancedSettings?.top_memo_structure.length > 0 ? this.advancedSettings?.top_memo_structure[0] : this.defaultTopMemoOptions[0], Validators.required],
          exportSchedule: [this.advancedSettings?.schedule_is_enabled ? this.advancedSettings?.schedule_is_enabled : false],
          email: [this.advancedSettings?.emails_selected.length > 0 ? this.advancedSettings?.emails_selected : []],
          frequency: [this.advancedSettings?.frequency ? this.advancedSettings?.frequency : null],
          dayOfMonth: [this.advancedSettings?.day_of_month ? this.advancedSettings?.day_of_month : null],
          dayOfWeek: [this.advancedSettings?.day_of_week ? this.advancedSettings?.day_of_week : null],
          timeOfDay: [resultTime[0]],
          meridiem: [resultTime[1]],
          search: [],
          searchOption: []
      });
      this.isLoading = false;
      this.setCustomValidator();
    }, error => {
      const resultTime = this.initialTime();
        this.advancedSettingsForm = this.formBuilder.group({
          expenseMemoStructure: [this.defaultMemoFields, Validators.required],
          topMemoStructure: [this.defaultTopMemoOptions[0], Validators.required],
          exportSchedule: [false],
          email: [[]],
          frequency: [null],
          dayOfMonth: [null],
          dayOfWeek: [null],
          timeOfDay: [resultTime[0]],
          meridiem: [resultTime[1]],
          search: []
        });
        this.isLoading = false;
        this.setCustomValidator();
      }
    );
  }

  setCustomValidator() {
    this.createMemoStructureWatcher();
    this.frequencyWatcher();
    this.scheduledWatcher();
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const advancedSettingPayload = QBDAdvancedSettingModel.constructPayload(this.advancedSettingsForm);
    this.advancedSettingService.postQbdAdvancedSettings(advancedSettingPayload).subscribe((response: QBDAdvancedSettingsGet) => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qbdAdvancedSetting.advancedSettingsSavedSuccess'));
      this.trackingService.trackTimeSpent(TrackingApp.QBD, Page.ADVANCED_SETTINGS_QBD, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === QBDOnboardingState.ADVANCED_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.QBD, QBDOnboardingState.ADVANCED_SETTINGS, 4, advancedSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.QBD,
          UpdateEvent.ADVANCED_SETTINGS_QBD,
          {
            phase: this.getPhase(),
            oldState: this.advancedSettings,
            newState: response
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/qbd/onboarding/done`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdAdvancedSetting.advancedSettingsSaveError'));
      });
  }

  save(): void {
    if (this.advancedSettingsForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  ngOnInit(): void {
    this.getAdminEmails();
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { QBDConfigurationCtaText, QBDOnboardingState, QBDScheduleFrequency } from 'src/app/core/models/enum/enum.model';
import { AdvancedSettingModel, QBDAdvancedSettingsGet, QBDEmailOption } from 'src/app/core/models/qbd/qbd-configuration/advanced-setting.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QbdAdvancedSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-advanced-setting.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

@Component({
  selector: 'app-advanced-setting',
  templateUrl: './advanced-setting.component.html',
  styleUrls: ['./advanced-setting.component.scss']
})
export class AdvancedSettingComponent implements OnInit {
  isOnboarding: any;

  isLoading: boolean;

  advancedSettingsForm: FormGroup;

  saveInProgress: boolean;

  ConfigurationCtaText = QBDConfigurationCtaText;

  advancedSettings: QBDAdvancedSettingsGet;

  QBDScheduleFrequency = QBDScheduleFrequency;

  frequencyOption: QBDExportSettingFormOption[] = [
    {
      value: QBDScheduleFrequency.DAILY,
      label: 'Daily'
    },
    {
      value: QBDScheduleFrequency.WEEKLY,
      label: 'Weelky'
    },
    {
      value: QBDScheduleFrequency.MONTHLY,
      label: 'Monthly'
    }
  ];

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  adminEmails: QBDEmailOption[];

  weeklyOptions: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  frequencyIntervals:QBDExportSettingFormOption[] = [...Array(30).keys()].map(day => {
    return {
      label: this.setFrequencyInterval(day+1) + ' of every month',
      value: day + 1
    };
  });

  constructor(
    private router: Router,
    private advancedSettingService: QbdAdvancedSettingService,
    private formBuilder: FormBuilder,
    private workspaceService: QbdWorkspaceService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private orgService: OrgService
  ) { }

  private setFrequencyInterval(day: number): string {
    if (day === 1) {
      return day + ' st';
    } else if (day === 2) {
      return day + ' nd';
    } else if (day === 3) {
      return day + ' rd';
    }
    return day + ' th';
  }

  private merdiemType(): string {
    const time = this.advancedSettings.time_of_day ? +this.advancedSettings.time_of_day.slice(0, 2) : 0;
    return time < 12 ? 'AM' : 'PM';
  }

  private initialTime(): string {
    const time = this.advancedSettings.time_of_day ? +this.advancedSettings.time_of_day.slice(0, 2) : 0;
    const seconds = this.advancedSettings.time_of_day ? this.advancedSettings.time_of_day.slice(3, 5) : '00';
    return time === 0 ? '12:00' : time.toString() + ':' + seconds;
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.orgService.getAdditionalEmails().subscribe((emailResponse: QBDEmailOption[]) => {
      this.adminEmails = emailResponse;
    });
    this.advancedSettingService.getQbdAdvancedSettings().subscribe((advancedSettingResponse : QBDAdvancedSettingsGet) => {
      this.advancedSettings = advancedSettingResponse;
      const emails: any[] = [];
      this.advancedSettingsForm = this.formBuilder.group({
        expenseMemoStructure: [this.advancedSettings?.expense_memo_structure.length > 0 ? this.advancedSettings?.expense_memo_structure : null],
          topMemoStructure: [this.advancedSettings?.top_memo_structure.length > 0 ? this.advancedSettings?.top_memo_structure : null],
          exportSchedule: [this.advancedSettings?.schedule_is_enabled ? this.advancedSettings?.schedule_is_enabled : false],
          exportScheduleFrequency: [this.advancedSettings?.interval_hours ? this.advancedSettings?.interval_hours : null],
          email: [this.advancedSettings?.emails.length > 0 ? emails : emails],
          frequency: [this.advancedSettings?.frequency ? this.advancedSettings?.frequency : null],
          dayOfMonth: [this.advancedSettings?.day_of_month ? this.advancedSettings?.day_of_month : null],
          dayOfWeek: [this.advancedSettings?.day_of_week ? this.advancedSettings?.day_of_week : null],
          timeOfDay: [this.initialTime()],
          meridiem: [this.merdiemType()]
      });
      this.isLoading = false;
    }, () => {
        this.advancedSettingsForm = this.formBuilder.group({
          expenseMemoStructure: [null],
          topMemoStructure: [null],
          exportSchedule: [false],
          exportScheduleFrequency: [null],
          email: [null],
          frequency: [null],
          dayOfMonth: [null],
          dayOfWeek: [null],
          timeOfDay: [this.initialTime()],
          meridiem: [this.merdiemType()]
        });
        this.isLoading = false;
      }
    );
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const advancedSettingPayload = AdvancedSettingModel.constructPayload(this.advancedSettingsForm);

    this.advancedSettingService.postQbdAdvancedSettings(advancedSettingPayload).subscribe((response: QBDAdvancedSettingsGet) => {
      this.saveInProgress = false;
      this.messageService.add({key: 'tl', severity: 'success', summary: 'Success', detail: 'Advanced settings saved successfully'});
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.FIELD_MAPPING);
        this.router.navigate([`/integrations/qbd/onboarding/field_mappings`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.messageService.add({key: 'tl', severity: 'error', summary: 'Error', detail: 'Error saving advanced settings, please try again later'});
      });
  }

  save(): void {
    if (this.advancedSettingsForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}

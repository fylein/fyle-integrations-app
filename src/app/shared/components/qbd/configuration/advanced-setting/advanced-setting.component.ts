import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { QBDConfigurationCtaText, QBDOnboardingState, QBDScheduleFrequency } from 'src/app/core/models/enum/enum.model';
import { AdvancedSettingModel, QBDAdvancedSettingsGet } from 'src/app/core/models/qbd/qbd-configuration/advanced-setting.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
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

  adminEmails: string[] = ['dhaarani.s@fyle.in'];

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
    private primengConfig: PrimeNGConfig
  ) { }

  private setFrequencyInterval(day: number) {
    if (day === 1) {
      return day + ' st';
    } else if (day === 2) {
      return day + ' nd';
    } else if (day === 3) {
      return day + ' rd';
    }
    return day + ' th';
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.advancedSettingService.getQbdAdvancedSettings().subscribe((advancedSettingResponse : QBDAdvancedSettingsGet) => {
      this.advancedSettings = advancedSettingResponse;
      this.advancedSettingsForm = this.formBuilder.group({
        expenseMemoStructure: [this.advancedSettings?.expense_memo_structure.length > 0 ? this.advancedSettings?.expense_memo_structure : null],
          topMemoStructure: [this.advancedSettings?.top_memo_structure.length > 0 ? this.advancedSettings?.top_memo_structure : null],
          exportSchedule: [this.advancedSettings?.schedule_is_enabled ? true : false],
          exportScheduleFrequency: [this.advancedSettings?.interval_hours ? this.advancedSettings?.interval_hours : null],
          email: [this.advancedSettings?.emails.length > 0 ? this.advancedSettings?.emails : null],
          frequency: [this.advancedSettings?.frequency ? this.advancedSettings?.frequency : null],
          dayOfMonth: [this.advancedSettings?.day_of_month ? this.advancedSettings?.day_of_month : null],
          dayOfWeek: [this.advancedSettings?.day_of_week ? this.advancedSettings?.day_of_week : null],
          timeOfDay: [this.advancedSettings?.time_of_day ? this.advancedSettings?.time_of_day : null],
          meridiem: [null]
      });
      this.isLoading = false;
    }, () => {
        this.advancedSettingsForm = this.formBuilder.group({
          expenseMemoStructure: [null],
          topMemoStructure: [null],
          exportSchedule: [null],
          exportScheduleFrequency: [null],
          email: [null],
          frequency: [null],
          dayOfMonth: [null],
          dayOfWeek: [null],
          timeOfDay: [null],
          meridiem: [null]
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

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

  weeklyOptions: string[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  frequencyIntervals:QBDExportSettingFormOption[] = [...Array(30).keys()].map(day => {
    return {
      label: this.setFrequencyInterval(day+1) + ' of every month',
      value: day + 1
    };
  });

  memoPreviewText: string;

  memoStructure: string[] = [];

  constructor(
    private router: Router,
    private advancedSettingService: QbdAdvancedSettingService,
    private formBuilder: FormBuilder,
    private workspaceService: QbdWorkspaceService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private orgService: OrgService
  ) { }

  private formatMemoPreview(): void {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: 'john.doe@acme.com',
      category: 'Meals and Entertainment',
      purpose: 'Client Meeting',
      merchant: 'Pizza Hut',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      expense_link: 'https://app.fylehq.com/app/main/#/enterprise/view_expense/'
    };
    this.memoPreviewText = '';
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        this.memoPreviewText += previewValues[field];
        if (index + 1 !== this.memoStructure.length) {
          this.memoPreviewText = this.memoPreviewText + ' - ';
        }
      }
    });
  }

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
    const time = this.advancedSettings?.time_of_day ? +this.advancedSettings.time_of_day.slice(0, 2) : 0;
    return time < 12 ? 'AM' : 'PM';
  }

  private initialTime(): string {
    const time = this.advancedSettings?.time_of_day ? +this.advancedSettings.time_of_day.slice(0, 2) : 0;
    const seconds = this.advancedSettings?.time_of_day ? this.advancedSettings.time_of_day.slice(3, 5) : '00';
    return time === 0 ? '12:00' : time.toString() + ':' + seconds;
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.value.expenseMemoStructure;
    this.formatMemoPreview();
    this.advancedSettingsForm.controls.expenseMemoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
    });
  }

  getAdminEmails() {
    this.isLoading= true;
    this.orgService.getAdditionalEmails().subscribe((emailResponse: QBDEmailOption[]) => {
      this.adminEmails = emailResponse;
      this.getSettingsAndSetupForm();
    });
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.advancedSettingService.getQbdAdvancedSettings().subscribe((advancedSettingResponse : QBDAdvancedSettingsGet) => {
      this.advancedSettings = advancedSettingResponse;
      this.advancedSettingsForm = this.formBuilder.group({
        expenseMemoStructure: [this.advancedSettings?.expense_memo_structure.length > 0 ? this.advancedSettings?.expense_memo_structure : this.defaultMemoFields],
          topMemoStructure: [this.advancedSettings?.top_memo_structure.length > 0 ? this.advancedSettings?.top_memo_structure : this.defaultMemoFields.slice(0, 3)],
          exportSchedule: [this.advancedSettings?.schedule_is_enabled ? this.advancedSettings?.schedule_is_enabled : false],
          email: [this.advancedSettings?.emails_selected.length > 0 ? this.advancedSettings?.emails_selected : []],
          frequency: [this.advancedSettings?.frequency ? this.advancedSettings?.frequency : null],
          dayOfMonth: [this.advancedSettings?.day_of_month ? this.advancedSettings?.day_of_month : null],
          dayOfWeek: [this.advancedSettings?.day_of_week ? this.advancedSettings?.day_of_week : null],
          timeOfDay: [this.initialTime()],
          meridiem: [this.merdiemType()]
      });
      this.isLoading = false;
      this.createMemoStructureWatcher();
    }, error => {
        this.advancedSettingsForm = this.formBuilder.group({
          expenseMemoStructure: [this.defaultMemoFields],
          topMemoStructure: [this.defaultMemoFields.slice(0, 3)],
          exportSchedule: [false],
          email: [[]],
          frequency: [null],
          dayOfMonth: [null],
          dayOfWeek: [null],
          timeOfDay: [this.initialTime()],
          meridiem: [this.merdiemType()]
        });
        this.isLoading = false;
        this.createMemoStructureWatcher();
      }
    );
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const currentTime = +this.advancedSettingsForm.controls.timeOfDay.value.slice(0, 2);
    const currentMins = this.advancedSettingsForm.controls.timeOfDay.value.slice(3, 5);
    const time = this.advancedSettingsForm.value.meridiem === 'PM' ? `${currentTime+12}:${currentMins}:00`: currentTime === 12 ? `00:${currentMins}:00` : `${currentTime}:${currentMins}:00`;
    this.advancedSettingsForm.controls.timeOfDay.patchValue(time);
    const advancedSettingPayload = AdvancedSettingModel.constructPayload(this.advancedSettingsForm);
    this.advancedSettingService.postQbdAdvancedSettings(advancedSettingPayload).subscribe((response: QBDAdvancedSettingsGet) => {
      this.saveInProgress = false;
      this.messageService.add({key: 'tl', severity: 'success', summary: 'Success', detail: 'Advanced settings saved successfully'});
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.FIELD_MAPPING);
        this.router.navigate([`/integrations/qbd/onboarding/done`]);
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
    this.getAdminEmails();
  }

}

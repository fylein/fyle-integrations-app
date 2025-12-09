import { Injectable } from '@angular/core';
import {
  Sage50AdvancedSettings,
  Sage50AdvancedSettingsForm,
  Sage50LineLevelMemoOption,
  Sage50TopLevelMemoOption,
} from 'src/app/core/models/sage50/sage50-configuration/sage50-advanced-settings.model';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { catchError, Observable, of } from 'rxjs';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ScheduleForm } from 'src/app/core/models/misc/schedule-dialog.model';
import { ScheduleFormService } from '../../misc/schedule-form.service';
import { TranslocoService } from '@jsverse/transloco';
import { AdvancedSettingsService } from '../../common/advanced-settings.service';
import { Sage50ExportSettingsGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';

@Injectable({
  providedIn: 'root',
})
export class Sage50AdvancedSettingsService extends AdvancedSettingsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private scheduleFormService: ScheduleFormService,
    private translocoService: TranslocoService,
  ) {
    super();
  }

  getSage50AdvancedSettings(): Observable<Sage50AdvancedSettings | null> {
    return this.apiService
      .get(`/${this.workspaceService.getWorkspaceId()}/settings/advanced_settings/`, {})
      .pipe(catchError(() => of(null)));
  }

  postSage50AdvancedSettings(payload: Sage50AdvancedSettings): Observable<Sage50AdvancedSettings> {
    return this.apiService.post(`/${this.workspaceService.getWorkspaceId()}/settings/advanced_settings/`, payload);
  }

  mapAPIResponseToScheduleFormGroup(advancedSettings: Sage50AdvancedSettings | null): FormGroup<ScheduleForm> {
    const UTCTimeOfDay = advancedSettings?.time_of_day ?? null;
    const { timeOfDay, meridiem } = this.scheduleFormService.getLocalTimeOfDay(UTCTimeOfDay);

    return new FormGroup<ScheduleForm>(
      {
        frequency: new FormControl(advancedSettings?.frequency ?? null),
        dayOfWeek: new FormControl(advancedSettings?.day_of_week ?? null),
        dayOfMonth: new FormControl(advancedSettings?.day_of_month ?? null),
        timeOfDay: new FormControl(timeOfDay ?? null),
        meridiem: new FormControl(meridiem ?? 'AM', { nonNullable: true }),
      },
      {
        validators: (formGroup) => {
          const errors: ValidationErrors = {};
          if (!formGroup.get('frequency')?.value) {
            errors.frequency = { required: true };
          }
          if (!formGroup.get('timeOfDay')?.value) {
            errors.timeOfDay = { required: true };
          }
          if (formGroup.get('frequency')?.value === 'WEEKLY' && !formGroup.get('dayOfWeek')?.value) {
            errors.dayOfWeek = { required: true };
          }
          if (formGroup.get('frequency')?.value === 'MONTHLY' && !formGroup.get('dayOfMonth')?.value) {
            errors.dayOfMonth = { required: true };
          }
          return Object.keys(errors).length > 0 ? errors : null;
        },
      },
    );
  }

  mapAPIResponseToFormGroup(
    advancedSettings: Sage50AdvancedSettings | null,
    isTopLevelMemoRequired: boolean,
    isSkipExportEnabled: boolean,
  ): FormGroup<Sage50AdvancedSettingsForm> {
    return new FormGroup<Sage50AdvancedSettingsForm>(
      {
        isScheduleEnabled: new FormControl(advancedSettings?.schedule_is_enabled ?? false, { nonNullable: true }),
        schedule: this.mapAPIResponseToScheduleFormGroup(advancedSettings),
        lineLevelMemoStructure: new FormControl(advancedSettings?.line_level_memo_structure ?? [], {
          nonNullable: true,
        }),
        topLevelMemoStructure: new FormControl(advancedSettings?.top_level_memo_structure ?? [], { nonNullable: true }),
        isSkipExportEnabled: new FormControl(isSkipExportEnabled, { nonNullable: true }),
      },
      {
        validators: (formGroup) => {
          const errors: ValidationErrors = {};

          if (!formGroup.get('lineLevelMemoStructure')?.value?.length) {
            errors.lineLevelMemoStructure = { required: true };
          }

          if (isTopLevelMemoRequired && !formGroup.get('topLevelMemoStructure')?.value?.length) {
            errors.topLevelMemoStructure = { required: true };
          }

          if (formGroup.get('schedule')?.errors) {
            errors.schedule = formGroup.get('schedule')?.errors;
          }

          return Object.keys(errors).length > 0 ? errors : null;
        },
      },
    );
  }

  constructPayloadAndSave(advancedSettingsForm: FormGroup<Sage50AdvancedSettingsForm>) {
    const schedulePayload = this.constructSchedulePayload(
      advancedSettingsForm.get('schedule') as FormGroup<ScheduleForm>,
    );

    return this.postSage50AdvancedSettings({
      schedule_is_enabled: advancedSettingsForm.get('isScheduleEnabled')?.value ?? false,
      ...schedulePayload,
      line_level_memo_structure: advancedSettingsForm.get('lineLevelMemoStructure')?.value ?? [],
      top_level_memo_structure: advancedSettingsForm.get('topLevelMemoStructure')?.value ?? [],
    });
  }

  /**
   * Converts time + meridiem to UTC time of format HH:MM:SS
   */
  constructSchedulePayload(schedule: FormGroup<ScheduleForm>) {
    const timeOfDayUTC = this.scheduleFormService.getUTCTimeOfDay(schedule);

    return {
      frequency: schedule.get('frequency')?.value ?? null,
      day_of_week: schedule.get('dayOfWeek')?.value ?? null,
      day_of_month: schedule.get('dayOfMonth')?.value ?? null,
      time_of_day: timeOfDayUTC,
    };
  }

  getTopLevelMemoOptions(exportSettings: Sage50ExportSettingsGet | null): Sage50TopLevelMemoOption[] {
    const isCCCEnabled = !!exportSettings?.credit_card_expense_export_type;

    return [Sage50TopLevelMemoOption.EMPLOYEE_NAME, ...(isCCCEnabled ? [Sage50TopLevelMemoOption.CARD_NUMBER] : [])];
  }

  getLineLevelMemoOptions(exportSettings: Sage50ExportSettingsGet | null): Sage50LineLevelMemoOption[] {
    const isCCCEnabled = !!exportSettings?.credit_card_expense_export_type;

    return [
      Sage50LineLevelMemoOption.EMPLOYEE_NAME,
      ...(isCCCEnabled ? [Sage50LineLevelMemoOption.CARD_NUMBER] : []),
      Sage50LineLevelMemoOption.PURPOSE,
      Sage50LineLevelMemoOption.SPENT_AT,
      Sage50LineLevelMemoOption.MERCHANT,
      ...(isCCCEnabled ? [Sage50LineLevelMemoOption.CARD_MERCHANT] : []),
    ];
  }
}

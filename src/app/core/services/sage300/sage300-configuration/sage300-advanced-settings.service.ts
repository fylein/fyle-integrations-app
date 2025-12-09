import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { Observable, Subject } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import {
  Sage300AdvancedSettingGet,
  Sage300AdvancedSettingPost,
} from 'src/app/core/models/sage300/sage300-configuration/sage300-advanced-settings.model';
import {
  ConditionField,
  EmailOption,
  ExpenseFilterPost,
  ExpenseFilterResponse,
  ExpenseFilter,
} from 'src/app/core/models/common/advanced-settings.model';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AdvancedSettingsService } from '../../common/advanced-settings.service';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

const sage300AdvancedSettingGetCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class Sage300AdvancedSettingsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private advanceSettingsService: AdvancedSettingsService,
    helper: HelperService,
  ) {
    helper.setBaseApiURL();
  }

  mapAPIResponseToFormGroup(
    advancedSettings: Sage300AdvancedSettingGet | null,
    isSkipExportEnabled: boolean,
    isOnboarding: boolean,
  ): FormGroup {
    const defaultMemoOptions: string[] = [
      'employee_email',
      'purpose',
      'category',
      'spent_on',
      'report_number',
      'expense_link',
    ];
    return new FormGroup({
      memoStructure: new FormControl(
        advancedSettings?.expense_memo_structure ? advancedSettings?.expense_memo_structure : defaultMemoOptions,
      ),
      scheduleEnabled: new FormControl(
        advancedSettings?.schedule_is_enabled ||
          (isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary)
          ? true
          : false,
      ),
      autoCreateVendor: new FormControl(advancedSettings?.auto_create_vendor ? true : false),
      scheduleAutoExportFrequency: new FormControl(
        this.advanceSettingsService.getExportFrequency(
          advancedSettings?.is_real_time_export_enabled,
          isOnboarding,
          advancedSettings?.schedule_is_enabled,
          advancedSettings?.interval_hours,
        ),
      ),
      skipExport: new FormControl(isSkipExportEnabled),
    });
  }

  createAdvancedSettingPayload(advancedSettingsForm: FormGroup): Sage300AdvancedSettingPost {
    return {
      expense_memo_structure: advancedSettingsForm.get('memoStructure')?.value
        ? advancedSettingsForm.get('memoStructure')?.value
        : null,
      schedule_is_enabled: advancedSettingsForm.get('scheduleEnabled')?.value
        ? advancedSettingsForm.get('scheduleEnabled')?.value
        : false,
      interval_hours: advancedSettingsForm.get('scheduleEnabled')?.value
        ? advancedSettingsForm.get('scheduleAutoExportFrequency')?.value
        : null,
      auto_create_vendor: advancedSettingsForm.get('autoCreateVendor')?.value
        ? advancedSettingsForm.get('autoCreateVendor')?.value
        : false,
      is_real_time_export_enabled:
        advancedSettingsForm.get('scheduleEnabled')?.value &&
        advancedSettingsForm.get('scheduleAutoExportFrequency')?.value === 0
          ? true
          : false,
    };
  }

  @Cacheable({
    cacheBusterObserver: sage300AdvancedSettingGetCache,
  })
  getAdvancedSettings(): Observable<Sage300AdvancedSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: sage300AdvancedSettingGetCache,
  })
  postAdvancedSettings(advancedSettingsPayload: Sage300AdvancedSettingPost): Observable<Sage300AdvancedSettingGet> {
    return this.apiService.post(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`,
      advancedSettingsPayload,
    );
  }
}

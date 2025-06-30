import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QbdDirectAdvancedSettingsGet, QbdDirectAdvancedSettingsPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { ApiService } from '../../common/api.service';
import { QbdWorkspaceService } from '../../qbd/qbd-core/qbd-workspace.service';
import { AdvancedSettingsService } from '../../common/advanced-settings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailOption } from 'src/app/core/models/common/advanced-settings.model';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectAdvancedSettingsService extends AdvancedSettingsService {

  private apiService: ApiService = inject(ApiService);

  private workspaceService: QbdWorkspaceService = inject(QbdWorkspaceService);

  private translocoService: TranslocoService = inject(TranslocoService);

  static defaultMemoFields(): string[] {
    return ['employee_name', 'employee_email',  'card_number', 'purpose', 'merchant', 'spent_on', 'expense_key', 'expense_link'];
  }

  static defaultTopMemoOptions(): string[] {
      return ["employee_name", "expense_key"];
  }

  topMemoExpenseKeyNameConversion(keys: string[]): string[] {
      keys.forEach((key: string, index: number) => {
          if (key === 'expense_key') {
              keys[index] = this.translocoService.translate('services.qbdDirectAdvancedSettings.expenseReportIdLabel');
          }
      });
      return keys;
  }

  static formatMemoStructure(memoStructure: string[], defaultMemoOptions: string[]): string[] {
      const originMemo: string[] = [];
      defaultMemoOptions.forEach((field, index) => {
          const defaultIndex = memoStructure.indexOf(field);
          originMemo[defaultIndex] = field;
      });

      return originMemo.filter((item: string) => item !== null);
    }

  static mapAPIResponseToFormGroup(advancedSettings: QbdDirectAdvancedSettingsGet | null, isSkipExportEnabled: boolean, isOnboarding: boolean): FormGroup {
      return new FormGroup({
          expenseMemoStructure: new FormControl(advancedSettings?.line_level_memo_structure && advancedSettings?.line_level_memo_structure.length > 0 ? QbdDirectAdvancedSettingsService.formatMemoStructure(QbdDirectAdvancedSettingsService.defaultMemoFields(), advancedSettings?.line_level_memo_structure) : QbdDirectAdvancedSettingsService.defaultMemoFields(), Validators.required),
          topMemoStructure: new FormControl(advancedSettings?.top_level_memo_structure && advancedSettings?.top_level_memo_structure.length > 0 ? advancedSettings?.top_level_memo_structure : QbdDirectAdvancedSettingsService.defaultTopMemoOptions(), Validators.required),
          exportSchedule: new FormControl(advancedSettings?.schedule_is_enabled || (isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary) ? true : false),
          email: new FormControl(advancedSettings?.emails_selected ? advancedSettings?.emails_selected : null),
          exportScheduleFrequency: new FormControl(AdvancedSettingsService.getExportFrequency(advancedSettings?.is_real_time_export_enabled, isOnboarding, advancedSettings?.schedule_is_enabled, advancedSettings?.interval_hours)),
          autoCreateReimbursableEnitity: new FormControl(advancedSettings?.auto_create_reimbursable_entity ? advancedSettings?.auto_create_reimbursable_entity : false),
          autoCreateMerchantsAsVendors: new FormControl(advancedSettings?.auto_create_merchant_as_vendor ? advancedSettings?.auto_create_merchant_as_vendor : false),
          skipExport: new FormControl(isSkipExportEnabled),
          searchOption: new FormControl('')
      });
  }

  static constructPayload (advancedSettingForm: FormGroup, adminEmails: EmailOption[]): QbdDirectAdvancedSettingsPost {
      const allSelectedEmails: EmailOption[] = advancedSettingForm.get('email')?.value;

      const selectedEmailsEmails = allSelectedEmails?.filter((email: EmailOption) => adminEmails.includes(email));

      const additionalEmails = allSelectedEmails?.filter((email: EmailOption) => !adminEmails.includes(email));

      const memo = advancedSettingForm.get('expenseMemoStructure')?.value ? advancedSettingForm.get('expenseMemoStructure')?.value : [];

      const advancedSettingPayload: QbdDirectAdvancedSettingsPost = {
          line_level_memo_structure: advancedSettingForm.get('expenseMemoStructure')?.value ? QbdDirectAdvancedSettingsService.formatMemoStructure(QbdDirectAdvancedSettingsService.defaultMemoFields(), memo) : [],
          top_level_memo_structure: advancedSettingForm.get('topMemoStructure')?.value ? advancedSettingForm.get('topMemoStructure')?.value : null,
          schedule_is_enabled: advancedSettingForm.get('exportSchedule')?.value ? advancedSettingForm.get('exportSchedule')?.value : false,
          emails_selected: advancedSettingForm.get('exportSchedule')?.value ? selectedEmailsEmails : [],
          interval_hours: advancedSettingForm.get('exportSchedule')?.value ? advancedSettingForm.get('exportScheduleFrequency')?.value : null,
          is_real_time_export_enabled: advancedSettingForm.get('exportSchedule')?.value && advancedSettingForm.get('exportScheduleFrequency')?.value === 0 ? true : false,
          auto_create_reimbursable_entity: advancedSettingForm.get('autoCreateReimbursableEnitity')?.value ? advancedSettingForm.get('autoCreateReimbursableEnitity')?.value : false,
          auto_create_merchant_as_vendor: advancedSettingForm.get('autoCreateMerchantsAsVendors')?.value ? advancedSettingForm.get('autoCreateMerchantsAsVendors')?.value : false,
          emails_added: advancedSettingForm.get('exportSchedule')?.value ? additionalEmails : []
      };

      return advancedSettingPayload;
  }

  getQbdAdvancedSettings(): Observable<QbdDirectAdvancedSettingsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  postQbdAdvancedSettings(advancedSettingPayload:QbdDirectAdvancedSettingsPost): Observable<QbdDirectAdvancedSettingsGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingPayload);
  }
}

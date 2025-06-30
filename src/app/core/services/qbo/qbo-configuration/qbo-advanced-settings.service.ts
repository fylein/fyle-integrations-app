import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { QBOAdvancedSettingGet, QBOAdvancedSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-advanced-setting.model';
import { AdvancedSettingsService } from '../../common/advanced-settings.service';
import { brandingConfig } from 'src/app/branding/branding-config';
import { QBOPaymentSyncDirection } from 'src/app/core/models/enum/enum.model';
import { FormGroup, FormControl } from '@angular/forms';
import { HelperUtility } from 'src/app/core/models/common/helper.model';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { EmailOption, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { AdvancedSettingValidatorRule } from 'src/app/core/models/common/advanced-settings.model';
import { TranslocoService } from '@jsverse/transloco';

const advancedSettingsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class  QboAdvancedSettingsService extends AdvancedSettingsService {

  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  private translocoService: TranslocoService = inject(TranslocoService);

  getPaymentSyncOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.qboAdvancedSettings.exportFyleACHPaymentsToQBO', { brandName: brandingConfig.brandName }),
        value: QBOPaymentSyncDirection.FYLE_TO_QBO
      },
      {
        label: this.translocoService.translate('services.qboAdvancedSettings.importQBOPaymentsToFyle', { brandName: brandingConfig.brandName }),
        value: QBOPaymentSyncDirection.QBO_TO_FYLE
      }
    ];
  }

  static getValidators(): AdvancedSettingValidatorRule {
    return {
      paymentSync: 'billPaymentAccount',
      exportSchedule: 'exportScheduleFrequency'
    };
  }

  static setConfigurationSettingValidatorsAndWatchers(form: FormGroup): void {
    const validatorRule = this.getValidators();
    const keys = Object.keys(validatorRule);

    Object.values(validatorRule).forEach((value, index) => {
      form.controls[keys[index]].valueChanges.subscribe((selectedValue) => {
        if (selectedValue && ((keys[index] === 'paymentSync' && selectedValue === QBOPaymentSyncDirection.FYLE_TO_QBO) || (keys[index] !== 'paymentSync'))) {
          HelperUtility.markControllerAsRequired(form, value);
        } else {
          HelperUtility.clearValidatorAndResetValue(form, value);
        }
      });
    });
  }

  mapAPIResponseToFormGroup(advancedSettings: QBOAdvancedSettingGet, isSkipExportEnabled: boolean, adminEmails: EmailOption[], shouldEnableAccountingPeriod: boolean, isOnboarding: boolean): FormGroup {
    return new FormGroup({
      paymentSync: new FormControl(advancedSettings?.workspace_general_settings.sync_fyle_to_qbo_payments ? QBOPaymentSyncDirection.FYLE_TO_QBO : advancedSettings?.workspace_general_settings.sync_qbo_to_fyle_payments ? QBOPaymentSyncDirection.QBO_TO_FYLE : null),
      billPaymentAccount: new FormControl(advancedSettings?.general_mappings.bill_payment_account?.id ? advancedSettings?.general_mappings.bill_payment_account : null),
      changeAccountingPeriod: new FormControl(shouldEnableAccountingPeriod ? true : advancedSettings?.workspace_general_settings.change_accounting_period),
      singleCreditLineJE: new FormControl(advancedSettings?.workspace_general_settings.je_single_credit_line),
      autoCreateVendors: new FormControl(advancedSettings?.workspace_general_settings.auto_create_destination_entity),
      autoCreateMerchantsAsVendors: new FormControl(advancedSettings?.workspace_general_settings.auto_create_merchants_as_vendors),
      exportSchedule: new FormControl(advancedSettings.workspace_schedules?.enabled || (isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary) ? true : false),
      exportScheduleFrequency: new FormControl(this.getExportFrequency(advancedSettings.workspace_schedules?.is_real_time_export_enabled, isOnboarding, advancedSettings.workspace_schedules?.enabled, advancedSettings.workspace_schedules?.interval_hours)),
      memoStructure: new FormControl(advancedSettings?.workspace_general_settings.memo_structure),
      skipExport: new FormControl(isSkipExportEnabled),
      searchOption: new FormControl(),
      search: new FormControl(),
      additionalEmails: new FormControl([]),
      email: new FormControl(advancedSettings?.workspace_schedules?.emails_selected && advancedSettings?.workspace_schedules?.emails_selected?.length > 0 ? AdvancedSettingsService.filterAdminEmails(advancedSettings?.workspace_schedules?.emails_selected, adminEmails) : [])
    });
  }

  static constructPayload(advancedSettingsForm: FormGroup): QBOAdvancedSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const advancedSettingPayload: QBOAdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_qbo_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === QBOPaymentSyncDirection.FYLE_TO_QBO ? true : false,
        sync_qbo_to_fyle_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === QBOPaymentSyncDirection.QBO_TO_FYLE ? true : false,
        auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
        auto_create_merchants_as_vendors: advancedSettingsForm.get('autoCreateMerchantsAsVendors')?.value,
        je_single_credit_line: !brandingFeatureConfig.featureFlags.advancedSettings.singleCreditLineJE ? true : advancedSettingsForm.get('singleCreditLineJE')?.value,
        change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
        memo_structure: advancedSettingsForm.get('memoStructure')?.value
      },
      general_mappings: {
        bill_payment_account: advancedSettingsForm.get('billPaymentAccount')?.value ? advancedSettingsForm.get('billPaymentAccount')?.value : emptyDestinationAttribute
      },
      workspace_schedules: {
        enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
        interval_hours: Number.isInteger(advancedSettingsForm.get('exportScheduleFrequency')?.value) ? advancedSettingsForm.get('exportScheduleFrequency')!.value : null,
        is_real_time_export_enabled: advancedSettingsForm.get('exportSchedule')?.value && advancedSettingsForm.get('exportScheduleFrequency')?.value === 0 ? true : false,
        emails_selected: advancedSettingsForm.get('email')?.value ? AdvancedSettingsService.formatSelectedEmails(advancedSettingsForm.get('email')?.value) : null,
        additional_email_options: advancedSettingsForm.get('additionalEmails')?.value ? advancedSettingsForm.get('additionalEmails')?.value[0] : null
      }
    };
    return advancedSettingPayload;
  }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<QBOAdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(exportSettingsPayload: QBOAdvancedSettingPost): Observable<QBOAdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, exportSettingsPayload);
  }
}

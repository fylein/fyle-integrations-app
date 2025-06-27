import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { Observable, Subject } from 'rxjs';
import { XeroAdvancedSettingGet, XeroAdvancedSettingPost } from 'src/app/core/models/xero/xero-configuration/xero-advanced-settings.model';
import { QBDEmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { AdvancedSettingsService } from '../../common/advanced-settings.service';
import { SelectFormOption, EmailOption } from 'src/app/core/models/common/select-form-option.model';
import { PaymentSyncDirection } from 'src/app/core/models/enum/enum.model';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AdvancedSettingValidatorRule } from 'src/app/core/models/common/advanced-settings.model';
import { FormGroup, FormControl } from '@angular/forms';
import { DefaultDestinationAttribute, DestinationAttribute } from "../../../models/db/destination-attribute.model";
import { HelperUtility } from 'src/app/core/models/common/helper.model';
import { ExportSettingsService } from '../../common/export-settings.service';


const advancedSettingsCache$ = new Subject<void>();
@Injectable({
  providedIn: 'root'
})
export class XeroAdvancedSettingsService extends AdvancedSettingsService {

  private apiService = inject(ApiService);

  private workspaceService = inject(WorkspaceService);

  constructor() {
    super();
  }

  static getPaymentSyncOptions(): SelectFormOption[] {
    return [
      {
        label: 'Export ' + brandingConfig.brandName + ' ACH payments to Xero',
        value: PaymentSyncDirection.FYLE_TO_XERO
      },
      {
        label: 'Import Xero payments into ' + brandingConfig.brandName,
        value: PaymentSyncDirection.XERO_TO_FYLE
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
        if (selectedValue && ((keys[index] === 'paymentSync' && selectedValue === PaymentSyncDirection.FYLE_TO_XERO) || (keys[index] !== 'paymentSync'))) {
          HelperUtility.markControllerAsRequired(form, value);
        } else {
          HelperUtility.clearValidatorAndResetValue(form, value);
        }
      });
    });
  }

  static mapAPIResponseToFormGroup(advancedSettings: XeroAdvancedSettingGet, adminEmails: EmailOption[], destinationAttribute: DestinationAttribute[], shouldEnableAccountingPeriod: boolean, isOnboarding: boolean): FormGroup {
    let paymentSync = '';
    if (advancedSettings.workspace_general_settings.sync_fyle_to_xero_payments) {
      paymentSync = PaymentSyncDirection.FYLE_TO_XERO;
    } else if (advancedSettings.workspace_general_settings.sync_xero_to_fyle_payments) {
      paymentSync = PaymentSyncDirection.XERO_TO_FYLE;
    }
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;

    return new FormGroup({
      paymentSync: new FormControl(paymentSync),
      billPaymentAccount: new FormControl(advancedSettings.general_mappings.payment_account.id ? findObjectByDestinationId(destinationAttribute, advancedSettings.general_mappings.payment_account.id) : null),
      changeAccountingPeriod: new FormControl(shouldEnableAccountingPeriod ? true : advancedSettings.workspace_general_settings.change_accounting_period),
      autoCreateVendors: new FormControl(advancedSettings.workspace_general_settings.auto_create_destination_entity),
      exportSchedule: new FormControl(advancedSettings.workspace_schedules?.enabled || (isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary) ? true : false),
      exportScheduleFrequency: new FormControl(this.getExportFrequency(advancedSettings.workspace_schedules?.is_real_time_export_enabled, isOnboarding, advancedSettings.workspace_schedules?.enabled, advancedSettings.workspace_schedules?.interval_hours)),
      autoCreateMerchantDestinationEntity: new FormControl(advancedSettings.workspace_general_settings.auto_create_merchant_destination_entity ? advancedSettings.workspace_general_settings.auto_create_merchant_destination_entity : false),
      memoStructure: new FormControl(advancedSettings.workspace_general_settings.memo_structure),
      search: new FormControl(),
      searchOption: new FormControl(),
      email: new FormControl(advancedSettings?.workspace_schedules?.emails_selected && advancedSettings?.workspace_schedules?.emails_selected?.length > 0 ? AdvancedSettingsService.filterAdminEmails(advancedSettings?.workspace_schedules?.emails_selected, adminEmails) : []),
      additionalEmails: new FormControl([])
    });
  }

  static constructPayload(advancedSettingsForm: FormGroup, isCloneSettings: boolean = false): XeroAdvancedSettingPost {
    const emptyDestinationAttribute: DefaultDestinationAttribute = {id: null, name: null};
    let paymentAccount = {...emptyDestinationAttribute};
    if (advancedSettingsForm.get('billPaymentAccount')?.value) {
      if (isCloneSettings) {
        paymentAccount = advancedSettingsForm.get('billPaymentAccount')?.value;
      } else {
        paymentAccount = ExportSettingsService.formatGeneralMappingPayload(advancedSettingsForm.get('billPaymentAccount')?.value);
      }
    }
    const advancedSettingPayload: XeroAdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_xero_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.FYLE_TO_XERO ? true : false,
        sync_xero_to_fyle_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.XERO_TO_FYLE ? true : false,
        auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
        change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
        auto_create_merchant_destination_entity: advancedSettingsForm.get('autoCreateMerchantDestinationEntity')?.value,
        memo_structure: advancedSettingsForm.get('memoStructure')?.value
      },
      general_mappings: {
        payment_account: paymentAccount
      },
      workspace_schedules: {
        enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
        interval_hours: Number.isInteger(advancedSettingsForm.get('exportScheduleFrequency')?.value) ? advancedSettingsForm.get('exportScheduleFrequency')!.value : null,
        is_real_time_export_enabled: advancedSettingsForm.get('exportSchedule')?.value && advancedSettingsForm.get('exportScheduleFrequency')?.value === 0 ? true : false,
        start_datetime: new Date(),
        emails_selected: advancedSettingsForm.get('email')?.value ? AdvancedSettingsService.formatSelectedEmails(advancedSettingsForm.get('email')?.value) : [],
        additional_email_options: advancedSettingsForm.get('additionalEmails')?.value ? advancedSettingsForm.get('additionalEmails')?.value : []
      }
    };
    return advancedSettingPayload;
  }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<XeroAdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(advancedSettingPayload: XeroAdvancedSettingPost): Observable<XeroAdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingPayload);
  }

  getWorkspaceAdmins(): Observable<[QBDEmailOptions]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }

}

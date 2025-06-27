import { FormControl, FormGroup } from "@angular/forms";
import { AdvancedSettingValidatorRule, EmailOption } from "../../common/advanced-settings.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
import { PaymentSyncDirection } from "../../enum/enum.model";
import { HelperUtility } from "../../common/helper.model";
import { ExportSettingModel } from "../../common/export-settings.model";
import { brandingConfig, brandingFeatureConfig } from "src/app/branding/branding-config";
import { AdvancedSettingsService } from "src/app/core/services/common/advanced-settings.service";


export type XeroAdvancedSettingWorkspaceGeneralSetting = {
  sync_fyle_to_xero_payments: boolean,
  sync_xero_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  change_accounting_period: boolean,
  auto_create_merchant_destination_entity: boolean,
  memo_structure: string[]
}

export type XeroAdvancedSettingGeneralMapping = {
  payment_account: DefaultDestinationAttribute
}

export type XeroAdvancedSettingWorkspaceSchedule = {
  enabled: boolean,
  interval_hours: number,
  start_datetime: Date,
  emails_selected: string[] | null,
  is_real_time_export_enabled: boolean,
  additional_email_options: EmailOption[]
}

export type XeroAdvancedSettingWorkspaceSchedulePost = {
  hours: number;
  schedule_enabled: boolean;
  emails_selected: string[];
  email_added: EmailOption[]
}

export type XeroAdvancedSettingPost = {
  workspace_general_settings: XeroAdvancedSettingWorkspaceGeneralSetting,
  general_mappings: XeroAdvancedSettingGeneralMapping,
  workspace_schedules: XeroAdvancedSettingWorkspaceSchedule
}

export type XeroAdvancedSettingGet = {
  workspace_general_settings: XeroAdvancedSettingWorkspaceGeneralSetting,
  general_mappings: XeroAdvancedSettingGeneralMapping,
  workspace_schedules: XeroAdvancedSettingWorkspaceSchedule,
  workspace_id:number
}

export type XeroAdvancedSettingAddEmailModel = {
  workspaceId: number;
  hours: number;
  schedulEnabled: boolean;
  selectedEmails: string[];
}

export interface XeroAdvancedSettingFormOption extends SelectFormOption {
  value: PaymentSyncDirection | number | 'None';
}

// TODO: Move to Service
export class XeroAdvancedSettingModel extends AdvancedSettingsService {

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
        paymentAccount = ExportSettingModel.formatGeneralMappingPayload(advancedSettingsForm.get('billPaymentAccount')?.value);
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
}

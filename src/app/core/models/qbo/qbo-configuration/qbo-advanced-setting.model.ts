import { FormControl, FormGroup } from "@angular/forms";
import { EmailOption, SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { QBOPaymentSyncDirection } from "../../enum/enum.model";
import { ExportSettingValidatorRule } from "../../common/export-settings.model";
import { AdvancedSettingValidatorRule, AdvancedSettingsModel } from "../../common/advanced-settings.model";
import { HelperUtility } from "../../common/helper.model";
import { brandingConfig, brandingFeatureConfig } from "src/app/branding/branding-config";


export type QBOAdvancedSettingWorkspaceGeneralSetting = {
  sync_fyle_to_qbo_payments: boolean,
  sync_qbo_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  auto_create_merchants_as_vendors: boolean,
  je_single_credit_line: boolean,
  change_accounting_period: boolean,
  memo_structure: string[]
}

export type QBOAdvancedSettingGeneralMapping = {
  bill_payment_account: DefaultDestinationAttribute
}

export type QBOAdvancedSettingWorkspaceSchedule = {
  enabled: boolean,
  interval_hours: number,
  emails_selected: string[] | null,
  is_real_time_export_enabled: boolean,
  additional_email_options: EmailOption[]
}

export type QBOAdvancedSettingWorkspaceSchedulePost = {
  hours: number;
  schedule_enabled: boolean;
  emails_selected: string[];
  email_added: EmailOption
}

export type QBOAdvancedSettingPost = {
  workspace_general_settings: QBOAdvancedSettingWorkspaceGeneralSetting,
  general_mappings: QBOAdvancedSettingGeneralMapping,
  workspace_schedules: QBOAdvancedSettingWorkspaceSchedule,
}

export type QBOAdvancedSettingGet = {
  workspace_general_settings: QBOAdvancedSettingWorkspaceGeneralSetting,
  general_mappings: QBOAdvancedSettingGeneralMapping,
  workspace_schedules: QBOAdvancedSettingWorkspaceSchedule,
  workspace_id:number
}

export type QBOAdvancedSettingAddEmailModel = {
  workspaceId: number;
  hours: number;
  schedulEnabled: boolean;
  selectedEmails: string[];
}

export class QBOAdvancedSettingModel extends AdvancedSettingsModel {
  static getPaymentSyncOptions(): SelectFormOption[] {
    return [
      {
        label: `Export ${brandingConfig.brandName} ACH Payments to QuickBooks Online`,
        value: QBOPaymentSyncDirection.FYLE_TO_QBO
      },
      {
        label: `Import QuickBooks Payments into ${brandingConfig.brandName}`,
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

  static mapAPIResponseToFormGroup(advancedSettings: QBOAdvancedSettingGet, isSkipExportEnabled: boolean, adminEmails: EmailOption[], shouldEnableAccountingPeriod: boolean, isOnboarding: boolean): FormGroup {
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
      email: new FormControl(advancedSettings?.workspace_schedules?.emails_selected && advancedSettings?.workspace_schedules?.emails_selected?.length > 0 ? AdvancedSettingsModel.filterAdminEmails(advancedSettings?.workspace_schedules?.emails_selected, adminEmails) : [])
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
        emails_selected: advancedSettingsForm.get('email')?.value ? AdvancedSettingsModel.formatSelectedEmails(advancedSettingsForm.get('email')?.value) : null,
        additional_email_options: advancedSettingsForm.get('additionalEmails')?.value ? advancedSettingsForm.get('additionalEmails')?.value[0] : null
      }
    };
    return advancedSettingPayload;
  }
}

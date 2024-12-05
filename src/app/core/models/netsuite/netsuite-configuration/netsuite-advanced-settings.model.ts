import { FormControl, FormGroup } from "@angular/forms";
import { EmailOption, SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { AppName, NetsuiteDefaultLevelOptions, NetsuitePaymentSyncDirection, PaymentSyncDirection } from "../../enum/enum.model";
import { AdvancedSettingValidatorRule, AdvancedSettingsModel } from "../../common/advanced-settings.model";
import { HelperUtility } from "../../common/helper.model";
import { brandingConfig } from "src/app/branding/branding-config";
import { environment } from "src/environments/environment";
import { NetSuiteExportSettingGet } from "./netsuite-export-setting.model";


export type NetsuiteAdvancedSettingConfiguration = {
  sync_fyle_to_netsuite_payments: boolean,
  sync_netsuite_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  auto_create_merchants: boolean,
  change_accounting_period: boolean,
  memo_structure: string[],
  je_single_credit_line: boolean
}

export type NetsuiteAdvancedSettingGeneralMapping = {
    vendor_payment_account: DefaultDestinationAttribute,
    netsuite_location: DefaultDestinationAttribute,
    netsuite_location_level: string,
    netsuite_department: DefaultDestinationAttribute,
    netsuite_department_level: string,
    netsuite_class: DefaultDestinationAttribute,
    netsuite_class_level: string,
    use_employee_class: boolean,
    use_employee_department: boolean,
    use_employee_location: boolean
}

export type NetsuiteAdvancedSettingWorkspaceSchedule = {
  enabled: boolean,
  interval_hours: number,
  emails_selected: string[] | null,
  additional_email_options: EmailOption[]
}

export type NetsuiteAdvancedSettingWorkspaceSchedulePost = {
  hours: number;
  schedule_enabled: boolean;
  emails_selected: string[];
  email_added: EmailOption
}

export type NetsuiteAdvancedSettingPost = {
  configuration: NetsuiteAdvancedSettingConfiguration,
  general_mappings: NetsuiteAdvancedSettingGeneralMapping,
  workspace_schedules: NetsuiteAdvancedSettingWorkspaceSchedule,
}

export type NetsuiteAdvancedSettingGet = {
  configuration: NetsuiteAdvancedSettingConfiguration,
  general_mappings: NetsuiteAdvancedSettingGeneralMapping,
  workspace_schedules: NetsuiteAdvancedSettingWorkspaceSchedule,
  workspace_id:number
}

export type NetsuiteAdvancedSettingAddEmailModel = {
  workspaceId: number;
  hours: number;
  schedulEnabled: boolean;
  selectedEmails: string[];
}

export class NetsuiteAdvancedSettingModel extends HelperUtility {
  static getDefaultMemoOptions(): string[] {
    return ['employee_email', 'employee_name', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'card_number'];
  }

  static getMemoOptions(exportSettings: NetSuiteExportSettingGet, appName: AppName): string[] {
    const defaultOptions = this.getDefaultMemoOptions();
    const cccExportType = exportSettings.configuration.corporate_credit_card_expenses_object;

    // Filter out options based on cccExportType and appName
    if (cccExportType) {
      return defaultOptions; // Allow all options including 'card_number'
    }
      return defaultOptions.filter(option => option !== 'card_number'); // Omit 'card_number' for other apps

  }

  static getPaymentSyncOptions(): SelectFormOption[] {
    return [
      {
        label: `Export ${brandingConfig.brandName} ACH Payments to NetSuite`,
        value: NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE
      },
      {
        label: `Import NetSuite Payments into ${brandingConfig.brandName}`,
        value: NetsuitePaymentSyncDirection.NETSUITE_TO_FYLE
      }
    ];
  }

  static getDefaultLevelOptions(): DefaultDestinationAttribute[] {
    return [
      {
        name: 'All',
        id: NetsuiteDefaultLevelOptions.ALL
      },
      {
        name: 'Transaction Line',
        id: NetsuiteDefaultLevelOptions.TRANSACTION_LINE
      },
      {
        name: 'Transaction Body',
        id: NetsuiteDefaultLevelOptions.TRANSACTION_BODY
      }
    ];
  }

  static getValidators(): AdvancedSettingValidatorRule {
    return {
      paymentSync: 'paymentAccount',
      exportSchedule: 'exportScheduleFrequency'
    };
  }

  static setConfigurationSettingValidatorsAndWatchers(form: FormGroup): void {
    const validatorRule = this.getValidators();
    const keys = Object.keys(validatorRule);

    Object.values(validatorRule).forEach((value, index) => {
      form.controls[keys[index]].valueChanges.subscribe((selectedValue) => {
        if (selectedValue && ((keys[index] === 'paymentSync' && selectedValue === NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE) || (keys[index] !== 'paymentSync'))) {
          this.markControllerAsRequired(form, value);
        } else {
          this.clearValidatorAndResetValue(form, value);
        }
      });
    });
  }

  static mapAPIResponseToFormGroup(advancedSettings: NetsuiteAdvancedSettingGet, isSkipExportEnabled: boolean, adminEmails: EmailOption[], shouldEnableAccountingPeriod: boolean): FormGroup {
    const level: DefaultDestinationAttribute[] = this.getDefaultLevelOptions();
    const findObjectByDestinationId = (id: string) => level?.find(item => item.id === id) || null;
    return new FormGroup({
      paymentSync: new FormControl(advancedSettings?.configuration.sync_fyle_to_netsuite_payments ? NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE : advancedSettings?.configuration.sync_netsuite_to_fyle_payments ? NetsuitePaymentSyncDirection.NETSUITE_TO_FYLE : null),
      paymentAccount: new FormControl(advancedSettings?.general_mappings.vendor_payment_account?.id ? advancedSettings?.general_mappings.vendor_payment_account : null ),
      netsuiteLocation: new FormControl(advancedSettings?.general_mappings.netsuite_location?.id ? advancedSettings?.general_mappings.netsuite_location : null),
      useEmployeeLocation: new FormControl(advancedSettings?.general_mappings.use_employee_location ? advancedSettings?.general_mappings.use_employee_location : false),
      netsuiteLocationLevel: new FormControl(advancedSettings?.general_mappings.netsuite_location_level ? findObjectByDestinationId(advancedSettings?.general_mappings.netsuite_location_level) :  this.getDefaultLevelOptions()[0]),
      netsuiteDepartment: new FormControl(advancedSettings?.general_mappings.netsuite_department?.id ? advancedSettings?.general_mappings.netsuite_department : null),
      netsuiteDepartmentLevel: new FormControl(advancedSettings?.general_mappings.netsuite_department_level ? findObjectByDestinationId(advancedSettings?.general_mappings.netsuite_department_level) : this.getDefaultLevelOptions()[0]),
      useEmployeeDepartment: new FormControl(advancedSettings?.general_mappings.use_employee_department ? advancedSettings?.general_mappings.use_employee_department : false),
      netsuiteClass: new FormControl(advancedSettings?.general_mappings.netsuite_class?.id ? advancedSettings?.general_mappings.netsuite_class : null),
      netsuiteClassLevel: new FormControl(advancedSettings?.general_mappings.netsuite_class_level ? findObjectByDestinationId(advancedSettings?.general_mappings.netsuite_class_level) : this.getDefaultLevelOptions()[0]),
      useEmployeeClass: new FormControl(advancedSettings?.general_mappings.use_employee_class ? advancedSettings?.general_mappings.use_employee_class : false),
      changeAccountingPeriod: new FormControl(shouldEnableAccountingPeriod ? true : advancedSettings?.configuration.change_accounting_period),
      autoCreateVendors: new FormControl(advancedSettings?.configuration.auto_create_destination_entity),
      singleCreditLineJE: new FormControl(advancedSettings?.configuration.je_single_credit_line),
      exportSchedule: new FormControl(advancedSettings?.workspace_schedules?.enabled ? true : false),
      exportScheduleFrequency: new FormControl(advancedSettings?.workspace_schedules?.enabled ? advancedSettings?.workspace_schedules.interval_hours : 1),
      memoStructure: new FormControl(advancedSettings?.configuration.memo_structure),
      autoCreateMerchants: new FormControl(advancedSettings?.configuration?.auto_create_merchants ? advancedSettings.configuration.auto_create_merchants : false),
      skipExport: new FormControl(isSkipExportEnabled),
      searchOption: new FormControl(),
      search: new FormControl(),
      additionalEmails: new FormControl([]),
      email: new FormControl(advancedSettings?.workspace_schedules?.emails_selected && advancedSettings?.workspace_schedules?.emails_selected?.length > 0 ? AdvancedSettingsModel.filterAdminEmails(advancedSettings?.workspace_schedules?.emails_selected, adminEmails) : [])
    });
  }

  static constructPayload(advancedSettingsForm: FormGroup): NetsuiteAdvancedSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};

    const advancedSettingPayload: NetsuiteAdvancedSettingPost = {
      configuration: {
        sync_fyle_to_netsuite_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE ? true : false,
        sync_netsuite_to_fyle_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === NetsuitePaymentSyncDirection.NETSUITE_TO_FYLE ? true : false,
        auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
        change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
        memo_structure: advancedSettingsForm.get('memoStructure')?.value,
        auto_create_merchants: advancedSettingsForm.get('autoCreateMerchants')?.value,
        je_single_credit_line: advancedSettingsForm.get('singleCreditLineJE')?.value || false
      },
      general_mappings: {
        vendor_payment_account: advancedSettingsForm.get('paymentAccount')?.value ? advancedSettingsForm.get('paymentAccount')?.value : emptyDestinationAttribute,
        netsuite_location: advancedSettingsForm.get('netsuiteLocation')?.value ? advancedSettingsForm.get('netsuiteLocation')?.value : emptyDestinationAttribute,
        netsuite_location_level: advancedSettingsForm.get('netsuiteLocationLevel')?.value ? advancedSettingsForm.get('netsuiteLocationLevel')?.value.id : '',
        netsuite_department: advancedSettingsForm.get('netsuiteDepartment')?.value ? advancedSettingsForm.get('netsuiteDepartment')?.value : emptyDestinationAttribute,
        netsuite_department_level: advancedSettingsForm.get('netsuiteDepartmentLevel')?.value ? advancedSettingsForm.get('netsuiteDepartmentLevel')?.value.id : '',
        netsuite_class: advancedSettingsForm.get('netsuiteClass')?.value ? advancedSettingsForm.get('netsuiteClass')?.value : emptyDestinationAttribute,
        netsuite_class_level: advancedSettingsForm.get('netsuiteClassLevel')?.value ? advancedSettingsForm.get('netsuiteClassLevel')?.value.id : '',
        use_employee_location: advancedSettingsForm.get('useEmployeeLocation')?.value,
        use_employee_class: advancedSettingsForm.get('useEmployeeClass')?.value,
        use_employee_department: advancedSettingsForm.get('useEmployeeDepartment')?.value
      },
      workspace_schedules: {
        enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
        interval_hours: advancedSettingsForm.get('exportSchedule')?.value && advancedSettingsForm.get('exportScheduleFrequency')?.value ? advancedSettingsForm.get('exportScheduleFrequency')?.value : null,
        emails_selected: advancedSettingsForm.get('email')?.value ? AdvancedSettingsModel.formatSelectedEmails(advancedSettingsForm.get('email')?.value) : null,
        additional_email_options: advancedSettingsForm.get('additionalEmails')?.value ? advancedSettingsForm.get('additionalEmails')?.value[0] : null
      }
    };
    return advancedSettingPayload;
  }
}

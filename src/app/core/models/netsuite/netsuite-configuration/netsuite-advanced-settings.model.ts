import { FormControl, FormGroup } from "@angular/forms";
import { EmailOption, SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { NetsuiteDefaultLevelOptions, NetsuitePaymentSyncDirection, QBOPaymentSyncDirection } from "../../enum/enum.model";
import { AdvancedSettingValidatorRule, AdvancedSettingsModel } from "../../common/advanced-settings.model";
import { HelperUtility } from "../../common/helper.model";
import { brandingConfig } from "src/app/branding/branding-config";


export type NetsuiteAdvancedSettingConfiguration = {
  sync_fyle_to_netsuite_payments: boolean,
  sync_netsuite_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  change_accounting_period: boolean,
  memo_structure: string[]
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

  static getDefaultLevelOptions(): SelectFormOption[] {
    return [
      {
        label: 'All',
        value: NetsuiteDefaultLevelOptions.ALL
      },
      {
        label: 'Transaction Line',
        value: NetsuiteDefaultLevelOptions.TRANSACTION_LINE
      },
      {
        label: 'Transaction Body',
        value: NetsuiteDefaultLevelOptions.TRANSACTION_BODY
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
        if (selectedValue) {
          this.markControllerAsRequired(form, value);
        } else {
          this.clearValidatorAndResetValue(form, value);
        }
      });
    });
  }

  static mapAPIResponseToFormGroup(advancedSettings: NetsuiteAdvancedSettingGet, isSkipExportEnabled: boolean, adminEmails: EmailOption[]): FormGroup {

    return new FormGroup({
      paymentSync: new FormControl(advancedSettings?.configuration.sync_fyle_to_netsuite_payments ? NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE : advancedSettings?.configuration.sync_netsuite_to_fyle_payments ? NetsuitePaymentSyncDirection.NETSUITE_TO_FYLE : null),
      paymentAccount: new FormControl(advancedSettings?.general_mappings.vendor_payment_account?.id ? advancedSettings?.general_mappings.vendor_payment_account : null ),
      netsuiteLocation: new FormControl(advancedSettings?.general_mappings.netsuite_location?.id ? advancedSettings?.general_mappings.netsuite_location : null),
      useEmployeeLocation: new FormControl(advancedSettings?.general_mappings.use_employee_location ? advancedSettings?.general_mappings.use_employee_location : false),
      netsuiteLocationLevel: new FormControl(advancedSettings?.general_mappings.netsuite_location_level ? advancedSettings?.general_mappings.netsuite_location_level : null),
      netsuiteDepartment: new FormControl(advancedSettings?.general_mappings.netsuite_department?.id ? advancedSettings?.general_mappings.netsuite_department : null),
      netsuiteDepartmentLevel: new FormControl(advancedSettings?.general_mappings.netsuite_department_level ? advancedSettings?.general_mappings.netsuite_department_level : null),
      useEmployeeDepartment: new FormControl(advancedSettings?.general_mappings.use_employee_department ? advancedSettings?.general_mappings.use_employee_department : false),
      netsuiteClass: new FormControl(advancedSettings?.general_mappings.netsuite_class?.id ? advancedSettings?.general_mappings.netsuite_class : null),
      netsuiteClassLevel: new FormControl(advancedSettings?.general_mappings.netsuite_class_level ? advancedSettings?.general_mappings.netsuite_class_level : null),
      useEmployeeClass: new FormControl(advancedSettings?.general_mappings.use_employee_class ? advancedSettings?.general_mappings.use_employee_class : false),
      changeAccountingPeriod: new FormControl(advancedSettings?.configuration.change_accounting_period),
      autoCreateVendors: new FormControl(advancedSettings?.configuration.auto_create_destination_entity),
      exportSchedule: new FormControl(advancedSettings?.workspace_schedules?.enabled ? true : false),
      exportScheduleFrequency: new FormControl(advancedSettings?.workspace_schedules?.enabled ? advancedSettings?.workspace_schedules.interval_hours : 1),
      memoStructure: new FormControl(advancedSettings?.configuration.memo_structure),
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
        memo_structure: advancedSettingsForm.get('memoStructure')?.value
      },
      general_mappings: {
        vendor_payment_account: advancedSettingsForm.get('paymentAccount')?.value ? advancedSettingsForm.get('paymentAccount')?.value : emptyDestinationAttribute,
        netsuite_location: advancedSettingsForm.get('netsuiteLocation')?.value ? advancedSettingsForm.get('netsuiteLocation')?.value : emptyDestinationAttribute,
        netsuite_location_level: advancedSettingsForm.get('netsuiteLocationLevel')?.value ? advancedSettingsForm.get('netsuiteLocationLevel')?.value : '',
        netsuite_department: advancedSettingsForm.get('netsuiteDepartment')?.value ? advancedSettingsForm.get('netsuiteDepartment')?.value : emptyDestinationAttribute,
        netsuite_department_level: advancedSettingsForm.get('netsuiteDepartmentLevel')?.value ? advancedSettingsForm.get('netsuiteDepartmentLevel')?.value : '',
        netsuite_class: advancedSettingsForm.get('netsuiteClass')?.value ? advancedSettingsForm.get('netsuiteClass')?.value : emptyDestinationAttribute,
        netsuite_class_level: advancedSettingsForm.get('netsuiteClassLevel')?.value ? advancedSettingsForm.get('netsuiteClassLevel')?.value : '',
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

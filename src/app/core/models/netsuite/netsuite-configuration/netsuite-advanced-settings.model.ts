import { FormControl, FormGroup } from '@angular/forms';
import { EmailOption, SelectFormOption } from '../../common/select-form-option.model';
import { DefaultDestinationAttribute } from '../../db/destination-attribute.model';
import {
  AppName,
  NetsuiteDefaultLevelOptions,
  NetsuitePaymentSyncDirection,
  PaymentSyncDirection,
} from '../../enum/enum.model';
import { AdvancedSettingValidatorRule } from '../../common/advanced-settings.model';
import { HelperUtility } from '../../common/helper.model';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { environment } from 'src/environments/environment';
import { NetSuiteExportSettingGet } from './netsuite-export-setting.model';
import { AdvancedSettingsService } from 'src/app/core/services/common/advanced-settings.service';

export type NetsuiteAdvancedSettingConfiguration = {
  sync_fyle_to_netsuite_payments: boolean;
  sync_netsuite_to_fyle_payments: boolean;
  auto_create_destination_entity: boolean;
  auto_create_merchants: boolean;
  change_accounting_period: boolean;
  memo_structure: string[];
  je_single_credit_line: boolean;
};

export type NetsuiteAdvancedSettingGeneralMapping = {
  vendor_payment_account: DefaultDestinationAttribute;
  netsuite_location: DefaultDestinationAttribute;
  netsuite_location_level: string;
  netsuite_department: DefaultDestinationAttribute;
  netsuite_department_level: string;
  netsuite_class: DefaultDestinationAttribute;
  netsuite_class_level: string;
  use_employee_class: boolean;
  use_employee_department: boolean;
  use_employee_location: boolean;
};

export type NetsuiteAdvancedSettingWorkspaceSchedule = {
  enabled: boolean;
  interval_hours: number;
  emails_selected: string[] | null;
  is_real_time_export_enabled: boolean;
  additional_email_options: EmailOption[];
};

export type NetsuiteAdvancedSettingWorkspaceSchedulePost = {
  hours: number;
  schedule_enabled: boolean;
  emails_selected: string[];
  email_added: EmailOption;
};

export type NetsuiteAdvancedSettingPost = {
  configuration: NetsuiteAdvancedSettingConfiguration;
  general_mappings: NetsuiteAdvancedSettingGeneralMapping;
  workspace_schedules: NetsuiteAdvancedSettingWorkspaceSchedule;
};

export type NetsuiteAdvancedSettingGet = {
  configuration: NetsuiteAdvancedSettingConfiguration;
  general_mappings: NetsuiteAdvancedSettingGeneralMapping;
  workspace_schedules: NetsuiteAdvancedSettingWorkspaceSchedule;
  workspace_id: number;
};

export type NetsuiteAdvancedSettingAddEmailModel = {
  workspaceId: number;
  hours: number;
  schedulEnabled: boolean;
  selectedEmails: string[];
};

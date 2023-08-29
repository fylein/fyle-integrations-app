export interface GeneralMappingEntity {
    id: string;
    name: string;
  }

  export type EmailOption = {
    email: string;
    name: string;
  }
export interface WorkspaceGeneralSettings {
    change_accounting_period: boolean;
    sync_fyle_to_sage_intacct_payments: boolean;
    sync_sage_intacct_to_fyle_payments: boolean;
    auto_create_destination_entity: boolean;
    auto_create_merchant_destination_entity: boolean;
    memo_structure: string[];
  }

  export interface GeneralMappings {
    payment_account: GeneralMappingEntity;
    default_location: GeneralMappingEntity;
    default_department: GeneralMappingEntity;
    default_class: GeneralMappingEntity;
    default_project: GeneralMappingEntity;
    default_item: GeneralMappingEntity;
    use_intacct_employee_departments: boolean;
    use_intacct_employee_locations: boolean;
  }

  export interface WorkspaceSchedules {
    enabled: boolean;
    start_datetime: string;
    interval_hours: number;
    emails_selected: string[];
    additional_email_options: EmailOption[];
  }

export type AdvancedSettingsGet = {
    workspace_general_settings: WorkspaceGeneralSettings;
    general_mappings: GeneralMappings;
    workspace_schedules: WorkspaceSchedules;
    workspace_id: number;
}

export type AdvancedSettingsPost = {
    workspace_general_settings: WorkspaceGeneralSettings;
    general_mappings: GeneralMappings;
    workspace_schedules: WorkspaceSchedules;
  }

export class AdvancedSettings {
}

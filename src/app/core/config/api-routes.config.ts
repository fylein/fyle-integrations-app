import { AppName, AccountingExportStatus } from '../models/enum/enum.model';

export enum ApiAction {
  // Auth & Token
  AUTH_LOGIN = 'fyle_auth_login',
  AUTH_LOGIN_WITH_REFRESH_TOKEN = 'auth_login_with_refresh_token',
  AUTH_CLUSTER_DOMAIN = 'auth_cluster_domain',
  AUTH_REFRESH_TOKEN = 'auth_refresh_token',

  // Settings (merged GET & POST)
  EXPORT_SETTINGS = 'export_settings',
  IMPORT_SETTINGS = 'import_settings',
  ADVANCED_SETTINGS = 'advanced_settings',

  // Import Configuration
  IMPORT_CODE_FIELDS_CONFIG = 'import_code_fields_config',
  IMPORTABLE_CHART_OF_ACCOUNTS = 'importable_chart_of_accounts',
  INTEGRATION_FIELDS = 'integration_fields',

  // Credentials & Connections (merged GET, POST, PATCH)
  CREDENTIALS = 'credentials',
  TOKEN_HEALTH = 'token_health',
  DISCONNECT_INTEGRATION = 'disconnect_integration',

  // Workspace (merged GET & POST)
  WORKSPACE = 'workspace',
  WORKSPACE_CONFIGURATION = 'workspace_configuration',
  WORKSPACE_GENERAL_SETTINGS = 'workspace_general_settings',
  WORKSPACE_ONBOARDING_STATE = 'workspace_onboarding_state',

  // Mappings
  MAPPINGS = 'mappings',
  MAPPING_CREATE = 'mapping_create',
  MAPPING_SETTINGS = 'mapping_settings',
  MAPPING_STATS = 'mapping_stats',
  MAP_EMPLOYEES = 'map_employees',
  AUTO_MAP_EMPLOYEES = 'auto_map_employees',
  DESTINATION_ATTRIBUTES = 'destination_attributes',
  PAGINATED_DESTINATION_ATTRIBUTES = 'paginated_destination_attributes',

  // Expenses & Expense Groups
  EXPENSES = 'expenses',
  EXPENSE_GROUPS = 'expense_groups',
  EXPENSE_GROUP_SETTINGS = 'expense_group_settings',

  // Accounting Exports
  ACCOUNTING_EXPORTS = 'accounting_exports',
  EXPORT_SUMMARY = 'export_summary',
  EXPORT_ERRORS = 'export_errors',
  EXPORT_DATA = 'export_data',
  EXPORTABLE_IDS = 'exportable_ids',
  EXPORTABLE_COUNT = 'exportable_count',
  ACCOUNTING_EXPORT_DOWNLOAD = 'accounting_export_download',

  // Sync & Trigger
  SYNC_EXPENSES = 'sync_expenses',
  TRIGGER_EXPORT = 'trigger_export',
  SYNC_DIMENSIONS = 'sync_dimensions',
  REFRESH_DIMENSIONS = 'refresh_dimensions',
  IMPORT_ATTRIBUTES = 'import_attributes',

  // Tasks
  TASKS = 'tasks',

  // Organization (merged GET & POST)
  ORGANIZATION = 'organization',
  ORG_SENDGRID = 'org_sendgrid',
  ORG_ADMINS = 'org_admins',
  ORG_TOKEN = 'org_token',

  // Expense Filters (merged GET, POST, DELETE)
  EXPENSE_FILTERS = 'expense_filters',
  FYLE_FIELDS = 'fyle_fields',

  // Clone Settings (merged GET & POST; CHECK is separate)
  CLONE_SETTINGS = 'clone_settings',
  CLONE_SETTINGS_EXISTS = 'clone_settings_exists',

  // Integration-Specific (merged GET & POST)
  INTEGRATIONS_LIST = 'integrations_list',
  SUBSIDIARY_MAPPING = 'subsidiary_mapping',
  TENANT_MAPPING = 'tenant_mapping',
  LOCATION_ENTITY_MAPPING = 'location_entity_mapping',
  COMPANY = 'company',
  FIELD_MAPPING = 'field_mapping',
  ASSISTED_SETUP = 'assisted_setup',
  CUSTOM_SEGMENTS = 'custom_segments',
  ADDITIONAL_EMAILS = 'additional_emails',
  LAST_EXPORT = 'last_export',

  // Third-party Services
  TRAVELPERK_SERVICES = 'travelperk_services',
  BAMBOOHR_SERVICES = 'bamboohr_services',
  WORKATO = 'workato',
  XERO_CONNECT = 'xero_connect',
}

type RouteConfig = {
  path: string;
  transformParams?: (params: any) => any;
};

type AppRouteMap = Partial<Record<AppName, RouteConfig>> & {
  default: RouteConfig;
};

/**
 * API_ROUTES Configuration
 *
 * This configuration maps ApiAction enums to their complete, absolute endpoint paths for each integration.
 *
 * Path Structure:
 * - All paths are COMPLETE and ABSOLUTE
 * - Paths use placeholders that will be replaced with actual values:
 *   - `{workspaceId}` - automatically replaced with WorkspaceService.getWorkspaceId()
 *   - `{orgId}` - automatically replaced with OrgService.getOrgId()
 *   - `{id}`, `{rank}`, etc. - replaced via pathParams argument in getRoute()
 *
 * Path Patterns by App:
 * - Auth endpoints: `/auth/...` (no workspace/org ID needed)
 * - Sage50: `/{workspaceId}/...` (no /workspaces/ prefix)
 * - Standard workspace: `/workspaces/{workspaceId}/...`
 * - Versioned workspace: `/v2/workspaces/{workspaceId}/...`
 * - Organization level: `/orgs/{orgId}/...`
 * - Root level: `/integrations/`, `/xero/connect/`
 *
 * App-specific Routing:
 * - Use app-specific keys (AppName.QBO, AppName.SAGE50, etc.) when endpoint paths differ by integration
 * - The `default` key is required and used as fallback when no app-specific route is defined
 * - transformParams function can be used to modify request parameters based on app-specific logic
 *
 */
export const API_ROUTES: Record<ApiAction, AppRouteMap> = {
  // Auth & Token
  [ApiAction.AUTH_LOGIN]: {
    default: { path: '/auth/login/' }
  },

  [ApiAction.AUTH_LOGIN_WITH_REFRESH_TOKEN]: {
    default: { path: '/auth/login_with_refresh_token/' }
  },

  [ApiAction.AUTH_CLUSTER_DOMAIN]: {
    default: { path: '/auth/cluster_domain/' }
  },

  [ApiAction.AUTH_REFRESH_TOKEN]: {
    default: { path: '/auth/refresh/' }
  },

  // Settings (merged GET & POST)
  [ApiAction.EXPORT_SETTINGS]: {
    [AppName.SAGE50]: { path: '/{workspaceId}/settings/export_settings/' },
    [AppName.NETSUITE]: { path: '/v2/workspaces/{workspaceId}/export_settings/' },
    [AppName.INTACCT]: { path: '/v2/workspaces/{workspaceId}/export_settings/' },
    [AppName.QBO]: { path: '/v2/workspaces/{workspaceId}/export_settings/' },
    [AppName.XERO]: { path: '/v2/workspaces/{workspaceId}/export_settings/' },
    default: { path: '/workspaces/{workspaceId}/export_settings/' }
  },

  [ApiAction.IMPORT_SETTINGS]: {
    [AppName.SAGE50]: { path: '/{workspaceId}/settings/import_settings/' },
    [AppName.NETSUITE]: { path: '/v2/workspaces/{workspaceId}/import_settings/' },
    [AppName.INTACCT]: { path: '/v2/workspaces/{workspaceId}/import_settings/' },
    [AppName.XERO]: { path: '/v2/workspaces/{workspaceId}/import_settings/' },
    [AppName.QBO]: { path: '/v2/workspaces/{workspaceId}/import_settings/' },
    default: { path: '/workspaces/{workspaceId}/import_settings/' }
  },

  [ApiAction.ADVANCED_SETTINGS]: {
    [AppName.SAGE50]: { path: '/{workspaceId}/settings/advanced_settings/' },
    [AppName.NETSUITE]: { path: '/v2/workspaces/{workspaceId}/advanced_configurations/' },
    [AppName.INTACCT]: { path: '/v2/workspaces/{workspaceId}/advanced_settings/' },
    [AppName.QBO]: { path: '/v2/workspaces/{workspaceId}/advanced_configurations/' },
    [AppName.XERO]: { path: '/v2/workspaces/{workspaceId}/advanced_settings/' },
    default: { path: '/workspaces/{workspaceId}/advanced_settings/' }
  },

  // Import Configuration
  [ApiAction.IMPORT_CODE_FIELDS_CONFIG]: {
    [AppName.SAGE50]: { path: '/{workspaceId}/settings/import_code_fields_config/' },
    [AppName.INTACCT]: { path: '/v2/workspaces/{workspaceId}/import_settings/import_code_fields_config/' },
    [AppName.QBO]: { path: '/v2/workspaces/{workspaceId}/import_settings/import_code_fields_config/' },
    [AppName.QBD_DIRECT]: { path: '/workspaces/{workspaceId}/import_code_fields_config/' },
    default: { path: '/workspaces/{workspaceId}/import_settings/import_code_fields_config/' } // Sage 300 only
  },

  [ApiAction.IMPORTABLE_CHART_OF_ACCOUNTS]: {
    default: { path: '/{workspaceId}/settings/importable_chart_of_accounts/' } // Sage 50 only
  },

  [ApiAction.INTEGRATION_FIELDS]: {
    [AppName.QBO]: { path: '/workspaces/{workspaceId}/qbo/fields/' },
    [AppName.QBD_DIRECT]: { path: '/workspaces/{workspaceId}/qbd/fields/' },
    [AppName.XERO]: { path: '/workspaces/{workspaceId}/xero/xero_fields/' },
    [AppName.NETSUITE]: { path: '/workspaces/{workspaceId}/netsuite/netsuite_fields/' },
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/sage_intacct/sage_intacct_fields/' },
    default: { path: '/workspaces/{workspaceId}/{app_name}/fields/' } // BC, Sage 300
  },

  // Credentials & Connections (merged GET, POST, PATCH)
  [ApiAction.CREDENTIALS]: {
    [AppName.QBO]: { path: '/workspaces/{workspaceId}/credentials/qbo/' },
    [AppName.QBD_DIRECT]: { path: '/workspaces/{workspaceId}/credentials/qbd/' },
    [AppName.XERO]: { path: '/workspaces/{workspaceId}/credentials/xero/' },
    [AppName.NETSUITE]: { path: '/workspaces/{workspaceId}/credentials/netsuite/' },
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/credentials/sage_intacct/' },
    [AppName.BUSINESS_CENTRAL]: { path: '/workspaces/{workspaceId}/credentials/business_central/' },
    [AppName.SAGE300]: { path: '/workspaces/{workspaceId}/credentials/sage300/' },
    default: { path: '/workspaces/{workspaceId}/credentials/' }
  },

  [ApiAction.TOKEN_HEALTH]: {
    default: { path: '/workspaces/{workspaceId}/token_health/' }
  },

  [ApiAction.DISCONNECT_INTEGRATION]: {
    [AppName.QBO]: { path: '/workspaces/{workspaceId}/qbo/disconnect/' },
    [AppName.XERO]: { path: '/workspaces/{workspaceId}/xero/disconnect/' },
    default: { path: '/workspaces/{workspaceId}/disconnect/' }
  },

  // Workspace (merged GET & POST)
  [ApiAction.WORKSPACE]: {
    default: { path: '/workspaces/' }
  },

  [ApiAction.WORKSPACE_CONFIGURATION]: {
    [AppName.SAGE50]: { path: '/{workspaceId}/configuration/' },
    default: { path: '/workspaces/{workspaceId}/configuration/' }
  },

  [ApiAction.WORKSPACE_GENERAL_SETTINGS]: {
    default: { path: '/workspaces/{workspaceId}/settings/general/' }
  },

  [ApiAction.WORKSPACE_ONBOARDING_STATE]: {
    default: { path: '/workspaces/{workspaceId}/onboarding_state/' }
  },

  // Mappings
  [ApiAction.MAPPINGS]: {
    [AppName.QBD]: { path: '/workspaces/{workspaceId}/qbd_mappings/' },
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/employee_mappings/' }, // Can also be /category_mappings/ or /mappings/ depending on type
    default: { path: '/workspaces/{workspaceId}/mappings/' }
  },

  [ApiAction.MAPPING_CREATE]: {
    [AppName.QBD]: { path: '/workspaces/{workspaceId}/qbd_mappings/' },
    default: { path: '/workspaces/{workspaceId}/mappings/' }
  },

  [ApiAction.MAPPING_SETTINGS]: {
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/mapping_settings/' },
    default: { path: '/workspaces/{workspaceId}/mappings/settings/' }
  },

  [ApiAction.MAPPING_STATS]: {
    [AppName.QBD]: { path: '/workspaces/{workspaceId}/qbd_mappings/stats/' },
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/mapping_stats/' },
    [AppName.SAGE50]: { path: '/{workspaceId}/mappings/destination_attributes_stats/' },
    default: { path: '/workspaces/{workspaceId}/mappings/stats/' }
  },

  [ApiAction.MAP_EMPLOYEES]: {
    default: { path: '/v2/workspaces/{workspaceId}/map_employees/' }
  },

  [ApiAction.AUTO_MAP_EMPLOYEES]: {
    default: { path: '/workspaces/{workspaceId}/mappings/auto_map_employees/trigger/' }
  },

  [ApiAction.DESTINATION_ATTRIBUTES]: {
    [AppName.QBO]: { path: '/workspaces/{workspaceId}/qbo/qbo_attributes/' },
    [AppName.SAGE300]: { path: '/workspaces/{workspaceId}/sage300/destination_attributes/' },
    [AppName.XERO]: { path: '/workspaces/{workspaceId}/xero/destination_attributes/' },
    default: { path: '/workspaces/{workspaceId}/mappings/destination_attributes/' }
  },

  [ApiAction.PAGINATED_DESTINATION_ATTRIBUTES]: {
    [AppName.SAGE50]: { path: '/{workspaceId}/mappings/paginated_destination_attributes/' },
    default: { path: '/workspaces/{workspaceId}/mappings/paginated_destination_attributes/' }
  },

  // Expenses & Expense Groups
  [ApiAction.EXPENSES]: {
    [AppName.NETSUITE]: { path: '/workspaces/{workspaceId}/fyle/expenses/v2/' },
    default: { path: '/workspaces/{workspaceId}/fyle/expenses/' }
  },

  [ApiAction.EXPENSE_GROUPS]: {
    [AppName.NETSUITE]: { path: '/workspaces/{workspaceId}/fyle/expense_groups/v2/' },
    [AppName.QBD_DIRECT]: {
      path: '/workspaces/{workspaceId}/export_logs/',
      transformParams: (params) => {
        if (params.status__in?.includes(AccountingExportStatus.FAILED)) {
          params.status__in = [AccountingExportStatus.ERROR, AccountingExportStatus.FATAL];
        }
        return params;
      }
    },
    default: { path: '/workspaces/{workspaceId}/fyle/expense_groups/' }
  },

  [ApiAction.EXPENSE_GROUP_SETTINGS]: {
    default: { path: '/workspaces/{workspaceId}/fyle/expense_group_settings/' }
  },

  // Accounting Exports
  [ApiAction.ACCOUNTING_EXPORTS]: {
    [AppName.QBD_DIRECT]: {
      path: '/workspaces/{workspaceId}/export_logs/',
      transformParams: (params) => {
        if (params.status__in?.includes(AccountingExportStatus.FAILED)) {
          params.status__in = [AccountingExportStatus.ERROR, AccountingExportStatus.FATAL];
        }
        delete params.type__in;
        return params;
      }
    },
    [AppName.SAGE50]: {
      path: '/workspaces/{workspaceId}/export_logs/',
      transformParams: (params) => {
        if (params.status__in?.includes(AccountingExportStatus.FAILED)) {
          params.status__in = [AccountingExportStatus.ERROR, AccountingExportStatus.FATAL];
        }
        delete params.type__in;
        return params;
      }
    },
    default: { path: '/workspaces/{workspaceId}/accounting_exports/' }
  },

  [ApiAction.EXPORT_SUMMARY]: {
    [AppName.QBD_DIRECT]: { path: '/workspaces/{workspaceId}/export_logs/summary/' },
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/export_detail/' },
    default: { path: '/workspaces/{workspaceId}/accounting_exports/summary/' }
  },

  [ApiAction.EXPORT_ERRORS]: {
    [AppName.QBD_DIRECT]: { path: '/workspaces/{workspaceId}/export_logs/errors/' },
    [AppName.INTACCT]: { path: '/v2/workspaces/{workspaceId}/errors/' },
    default: { path: '/workspaces/{workspaceId}/accounting_exports/errors/' }
  },

  [ApiAction.EXPORT_DATA]: {
    default: { path: '/{workspaceId}/export_logs/export_data/' }
  },

  [ApiAction.EXPORTABLE_IDS]: {
    default: { path: '/workspaces/{workspaceId}/fyle/exportable_accounting_exports/' }
  },

  [ApiAction.EXPORTABLE_COUNT]: {
    default: { path: '/workspaces/{workspaceId}/export_logs/ready_to_export_count/' }
  },

  [ApiAction.ACCOUNTING_EXPORT_DOWNLOAD]: {
    default: { path: '/workspaces/{workspaceId}/accounting_exports/{id}/download/' }
  },

  // Sync & Trigger
  [ApiAction.SYNC_EXPENSES]: {
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/fyle/sync_expenses/' },
    default: { path: '/workspaces/{workspaceId}/fyle/accounting_exports/sync/' }
  },

  [ApiAction.TRIGGER_EXPORT]: {
    [AppName.QBD]: { path: '/workspaces/{workspaceId}/trigger_export/' },
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/fyle/export/' },
    default: { path: '/workspaces/{workspaceId}/exports/trigger/' }
  },

  [ApiAction.SYNC_DIMENSIONS]: {
    [AppName.QBO]: { path: '/workspaces/{workspaceId}/qbo/sync_dimensions/' },
    [AppName.NETSUITE]: { path: '/workspaces/{workspaceId}/netsuite/sync_dimensions/' },
    [AppName.XERO]: { path: '/workspaces/{workspaceId}/xero/sync_dimensions/' },
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/sage_intacct/sync_dimensions/' },
    [AppName.QBD_DIRECT]: { path: '/workspaces/{workspaceId}/qbd_direct/sync_dimensions/' },
    [AppName.QBD]: { path: '/workspaces/{workspaceId}/fyle/sync_dimensions/' },
    default: { path: '/workspaces/{workspaceId}/fyle/sync_dimensions/' }
  },

  [ApiAction.REFRESH_DIMENSIONS]: {
    [AppName.QBO]: { path: '/workspaces/{workspaceId}/qbo/refresh_dimensions/' },
    [AppName.NETSUITE]: { path: '/workspaces/{workspaceId}/netsuite/refresh_dimensions/' },
    [AppName.XERO]: { path: '/workspaces/{workspaceId}/xero/refresh_dimensions/' },
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/sage_intacct/refresh_dimensions/' },
    [AppName.BUSINESS_CENTRAL]: { path: '/workspaces/{workspaceId}/business_central/import_attributes/' },
    default: { path: '/workspaces/{workspaceId}/fyle/refresh_dimensions/' }
  },

  [ApiAction.IMPORT_ATTRIBUTES]: {
    [AppName.QBD_DIRECT]: { path: '/workspaces/{workspaceId}/qbd_direct/import_attributes/' },
    [AppName.BUSINESS_CENTRAL]: { path: '/workspaces/{workspaceId}/business_central/import_attributes/' },
    [AppName.SAGE300]: { path: '/workspaces/{workspaceId}/sage300/import_attributes/' },
    [AppName.SAGE50]: { path: '/{workspaceId}/accounting_imports/' },
    default: { path: '/workspaces/{workspaceId}/import_attributes/' }
  },

  // Tasks
  [ApiAction.TASKS]: {
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/tasks/v2/all/' },
    [AppName.NETSUITE]: { path: '/workspaces/{workspaceId}/tasks/v2/all/' },
    [AppName.QBD_DIRECT]: { path: '/workspaces/{workspaceId}/export_logs/' },
    default: { path: '/workspaces/{workspaceId}/tasks/all/' }
  },

  // Organization (merged GET & POST)
  [ApiAction.ORGANIZATION]: {
    default: { path: '/orgs/' }
  },

  [ApiAction.ORG_SENDGRID]: {
    default: { path: '/orgs/{orgId}/sendgrid/' }
  },

  [ApiAction.ORG_ADMINS]: {
    default: { path: '/workspaces/{workspaceId}/admins/' }
  },

  [ApiAction.ORG_TOKEN]: {
    default: { path: '/orgs/{orgId}/token/' }
  },

  // Expense Filters (merged GET, POST, DELETE)
  [ApiAction.EXPENSE_FILTERS]: {
    default: { path: '/workspaces/{workspaceId}/fyle/expense_filters/' }
  },

  [ApiAction.FYLE_FIELDS]: {
    [AppName.INTACCT]: { path: '/workspaces/{workspaceId}/fyle/expense_custom_fields/' },
    default: { path: '/workspaces/{workspaceId}/fyle/fields/' }
  },

  // Clone Settings (merged GET & POST; CHECK is separate)
  [ApiAction.CLONE_SETTINGS]: {
    default: { path: '/v2/workspaces/{workspaceId}/clone_settings/' }
  },

  [ApiAction.CLONE_SETTINGS_EXISTS]: {
    default: { path: '/user/clone_settings/exists/' }
  },

  // Integration-Specific (merged GET & POST)
  [ApiAction.INTEGRATIONS_LIST]: {
    default: { path: '/integrations/' }
  },

  [ApiAction.SUBSIDIARY_MAPPING]: {
    default: { path: '/workspaces/{workspaceId}/mappings/subsidiary/' }
  },

  [ApiAction.TENANT_MAPPING]: {
    [AppName.XERO]: { path: '/workspaces/{workspaceId}/xero/tenant_mappings/' },
    default: { path: '/workspaces/{workspaceId}/xero/tenant_mappings/' }
  },

  [ApiAction.LOCATION_ENTITY_MAPPING]: {
    default: { path: '/workspaces/{workspaceId}/mappings/location_entity/' }
  },

  [ApiAction.COMPANY]: {
    default: { path: '/workspaces/{workspaceId}/business_central/company/' }
  },

  [ApiAction.FIELD_MAPPING]: {
    default: { path: '/workspaces/{workspaceId}/qbd/field_mappings/' }
  },

  [ApiAction.ASSISTED_SETUP]: {
    default: { path: '/workspaces/{workspaceId}/qbd_direct/assisted_setup/' }
  },

  [ApiAction.CUSTOM_SEGMENTS]: {
    default: { path: '/workspaces/{workspaceId}/netsuite/custom_segments/' }
  },

  [ApiAction.ADDITIONAL_EMAILS]: {
    default: { path: '/workspaces/{workspaceId}/admin_emails/' }
  },

  [ApiAction.LAST_EXPORT]: {
    default: { path: '/workspaces/{workspaceId}/export_detail/' }
  },

  // Third-party Services
  [ApiAction.TRAVELPERK_SERVICES]: {
    default: { path: '/orgs/{orgId}/travelperk/' }
  },

  [ApiAction.BAMBOOHR_SERVICES]: {
    default: { path: '/orgs/{orgId}/bamboo_hr/' }
  },

  [ApiAction.WORKATO]: {
    default: { path: '/workspaces/{workspaceId}/workato_workspace/' }
  },

  [ApiAction.XERO_CONNECT]: {
    default: { path: '/xero/connect/' }
  }
};


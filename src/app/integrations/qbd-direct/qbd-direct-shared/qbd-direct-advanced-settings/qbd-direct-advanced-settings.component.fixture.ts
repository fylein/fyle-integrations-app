import { FormGroup, FormControl } from '@angular/forms';
import { QbdDirectAdvancedSettingsGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { QbdDirectExportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import {
  ExpenseFilterResponse,
  ConditionField,
  EmailOption,
  ExpenseFilter,
} from 'src/app/core/models/common/advanced-settings.model';
import { QbdDirectImportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model';
import {
  EmployeeFieldMapping,
  NameInJournalEntry,
  QBDCorporateCreditCardExpensesObject,
  Operator,
  JoinOption,
} from 'src/app/core/models/enum/enum.model';

export class QbdDirectAdvancedSettingsComponentFixture {
  /**
   * Creates fixture data for component initialization
   */
  static createBasicComponentFixture(): any {
    return {
      isLoading: false,
      isOnboarding: false,
      advancedSettingsForm: this.createAdvancedSettingsForm(),
      skipExportForm: this.createSkipExportForm(),
      qbdDirectAdvancedSettings: this.createQbdDirectAdvancedSettings(),
      qbdDirectExportSettings: this.createQbdDirectExportSettings(),
      expenseFilters: this.createExpenseFilters(),
      conditionFieldOptions: this.createConditionFieldOptions(),
      adminEmails: this.createAdminEmails(),
      employeeMapping: EmployeeFieldMapping.VENDOR,
      isReimbursableExportTypePresent: true,
      isImportVendorAsMerchantPresent: true,
      showAutoCreateMerchantsAsVendorsField: true,
      memoPreviewText: 'John Doe - Uber',
      topMemoPreviewText: 'Business Travel',
      memoStructure: ['employee_name', 'merchant'],
    };
  }

  /**
   * Creates fixture data for onboarding scenario
   */
  static createOnboardingFixture(): any {
    return {
      ...this.createBasicComponentFixture(),
      isOnboarding: true,
      qbdDirectAdvancedSettings: this.createOnboardingAdvancedSettings(),
    };
  }

  /**
   * Creates fixture data with skip export enabled
   */
  static createSkipExportFixture(): any {
    return {
      ...this.createBasicComponentFixture(),
      expenseFilters: this.createExpenseFiltersWithData(),
      skipExportForm: this.createSkipExportFormWithData(),
    };
  }

  /**
   * Helper method to create advanced settings form
   */
  private static createAdvancedSettingsForm(): FormGroup {
    return new FormGroup({
      expenseMemoStructure: new FormControl(['employee_name', 'merchant']),
      topMemoStructure: new FormControl(['purpose']),
      exportSchedule: new FormControl(true),
      email: new FormControl([{ email: 'admin@example.com', name: 'Admin' }]),
      exportScheduleFrequency: new FormControl(6),
      autoCreateReimbursableEntity: new FormControl(true),
      autoCreateMerchantsAsVendors: new FormControl(true),
      skipExport: new FormControl(false),
      searchOption: new FormControl(''),
    });
  }

  /**
   * Helper method to create skip export form
   */
  private static createSkipExportForm(): FormGroup {
    return new FormGroup({
      condition1: new FormControl(null),
      operator1: new FormControl(null),
      value1: new FormControl(null),
      join_by: new FormControl(null),
      condition2: new FormControl(null),
      operator2: new FormControl(null),
      value2: new FormControl(null),
    });
  }

  /**
   * Helper method to create skip export form with data
   */
  private static createSkipExportFormWithData(): FormGroup {
    return new FormGroup({
      condition1: new FormControl('employee_email'),
      operator1: new FormControl('equals'),
      value1: new FormControl('test@example.com'),
      join_by: new FormControl('AND'),
      condition2: new FormControl('amount'),
      operator2: new FormControl('greater_than'),
      value2: new FormControl('100'),
    });
  }

  /**
   * Helper method to create QBD Direct advanced settings
   */
  private static createQbdDirectAdvancedSettings(): QbdDirectAdvancedSettingsGet {
    return {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      workspace_id: 1,
      line_level_memo_structure: ['employee_name', 'merchant'],
      top_level_memo_structure: ['purpose'],
      schedule_is_enabled: true,
      emails_selected: [{ email: 'admin@example.com', name: 'Admin' }],
      emails_added: [],
      interval_hours: 6,
      auto_create_merchant_as_vendor: true,
      auto_create_reimbursable_entity: true,
      is_real_time_export_enabled: false,
    };
  }

  /**
   * Helper method to create onboarding advanced settings
   */
  private static createOnboardingAdvancedSettings(): QbdDirectAdvancedSettingsGet {
    return {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      workspace_id: 1,
      line_level_memo_structure: ['employee_name', 'merchant'],
      top_level_memo_structure: ['purpose'],
      schedule_is_enabled: false,
      emails_selected: [],
      emails_added: [],
      interval_hours: 6,
      auto_create_merchant_as_vendor: false,
      auto_create_reimbursable_entity: false,
      is_real_time_export_enabled: false,
    };
  }

  /**
   * Helper method to create QBD Direct export settings
   */
  private static createQbdDirectExportSettings(): QbdDirectExportSettingGet {
    return {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1,
      reimbursable_expense_export_type: null,
      reimbursable_expense_state: null,
      reimbursable_expense_date: null,
      reimbursable_expense_grouped_by: null,
      credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE,
      credit_card_expense_state: null,
      credit_card_expense_grouped_by: null,
      credit_card_expense_date: null,
      employee_field_mapping: EmployeeFieldMapping.VENDOR,
      name_in_journal_entry: NameInJournalEntry.EMPLOYEE,
      default_credit_card_account_name: '',
      default_credit_card_account_id: '',
      default_reimbursable_accounts_payable_account_name: '',
      default_reimbursable_accounts_payable_account_id: '',
      default_ccc_accounts_payable_account_name: '',
      default_ccc_accounts_payable_account_id: '',
    };
  }

  /**
   * Helper method to create expense filters
   */
  private static createExpenseFilters(): ExpenseFilterResponse {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }

  /**
   * Helper method to create expense filters with data
   */
  private static createExpenseFiltersWithData(): ExpenseFilterResponse {
    return {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          condition: 'employee_email',
          operator: Operator.IExact,
          values: ['test@example.com'],
          join_by: JoinOption.AND,
          rank: 1,
          is_custom: false,
          custom_field_type: null,
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1,
        },
        {
          id: 2,
          condition: 'amount',
          operator: Operator.LessThan,
          values: ['100'],
          join_by: null,
          rank: 2,
          is_custom: false,
          custom_field_type: null,
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1,
        },
      ],
    };
  }

  /**
   * Helper method to create condition field options
   */
  private static createConditionFieldOptions(): ConditionField[] {
    return [
      {
        field_name: 'employee_email',
        type: 'text',
        is_custom: false,
      },
      {
        field_name: 'amount',
        type: 'number',
        is_custom: false,
      },
      {
        field_name: 'category',
        type: 'text',
        is_custom: false,
      },
      {
        field_name: 'vendor',
        type: 'text',
        is_custom: false,
      },
      {
        field_name: 'project',
        type: 'text',
        is_custom: false,
      },
    ];
  }

  /**
   * Helper method to create admin emails
   */
  private static createAdminEmails(): EmailOption[] {
    return [
      { email: 'admin@example.com', name: 'Admin User' },
      { email: 'manager@example.com', name: 'Manager User' },
      { email: 'finance@example.com', name: 'Finance Team' },
    ];
  }

  /**
   * Helper method to create import settings
   */
  static createImportSettings(): QbdDirectImportSettingGet {
    return {
      import_settings: {
        import_account_as_category: true,
        import_item_as_category: false,
        import_vendor_as_merchant: false,
        chart_of_accounts: ['Account 1', 'Account 2'],
        import_code_fields: ['field1', 'field2'],
      },
      mapping_settings: [],
      workspace_id: 1,
    };
  }

  /**
   * Creates fixture data for real-time export scenario
   */
  static createRealTimeExportFixture(): any {
    return {
      ...this.createBasicComponentFixture(),
      qbdDirectAdvancedSettings: {
        ...this.createQbdDirectAdvancedSettings(),
        is_real_time_export_enabled: true,
      },
    };
  }

  /**
   * Creates fixture data for scheduled export scenario
   */
  static createScheduledExportFixture(): any {
    return {
      ...this.createBasicComponentFixture(),
      qbdDirectAdvancedSettings: {
        ...this.createQbdDirectAdvancedSettings(),
        schedule_is_enabled: true,
        interval_hours: 12,
        emails_selected: [
          { email: 'admin@example.com', name: 'Admin' },
          { email: 'manager@example.com', name: 'Manager' },
        ],
      },
    };
  }

  /**
   * Creates fixture data for auto-create scenario
   */
  static createAutoCreateFixture(): any {
    return {
      ...this.createBasicComponentFixture(),
      qbdDirectAdvancedSettings: {
        ...this.createQbdDirectAdvancedSettings(),
        auto_create_merchant_as_vendor: true,
        auto_create_reimbursable_entity: true,
      },
    };
  }

  /**
   * Creates fixture data for memo structure scenario
   */
  static createMemoStructureFixture(): any {
    return {
      ...this.createBasicComponentFixture(),
      qbdDirectAdvancedSettings: {
        ...this.createQbdDirectAdvancedSettings(),
        line_level_memo_structure: ['employee_name', 'merchant', 'category'],
        top_level_memo_structure: ['purpose', 'project'],
      },
      memoPreviewText: 'John Doe - Uber - Travel',
      topMemoPreviewText: 'Business Travel - Project Alpha',
      memoStructure: ['employee_name', 'merchant', 'category'],
    };
  }
}

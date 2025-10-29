import {
  AccountingExportSummary
} from 'src/app/core/models/db/accounting-export-summary.model';
import {
  DestinationFieldMap
} from 'src/app/core/models/db/dashboard.model';
import {
  AccountingGroupedErrors,
  AccountingGroupedErrorStat
} from 'src/app/core/models/db/error.model';
import {
  ReimbursableImportState,
  CCCImportState
} from 'src/app/core/models/enum/enum.model';

export class QbdDirectDashboardComponentFixture {

  /**
   * Creates fixture data for component initialization
   */
  static createBasicFixtureData(): any {
    return {
      isLoading: false,
      isImportInProgress: false,
      isExportInProgress: false,
      exportableAccountingExportIds: [1, 2, 3],
      failedExpenseGroupCount: 0,
      exportProgressPercentage: 0,
      accountingExportSummary: this.createAccountingExportSummary(),
      isRealTimeExportEnabled: false,
      processedCount: 0,
      errors: this.createGroupedErrors(),
      destinationFieldMap: this.createDestinationFieldMap(),
      groupedErrorStat: this.createGroupedErrorStat(),
      isImportItemsEnabled: true,
      reimbursableImportState: ReimbursableImportState.PROCESSING,
      cccImportState: CCCImportState.APPROVED,
      importCodeFields: ['field1', 'field2'],
      chartOfAccounts: ['Account 1', 'Account 2']
    };
  }

  /**
   * Helper method to create accounting export summary
   */
  private static createAccountingExportSummary(): AccountingExportSummary {
    return {
      id: 1,
      last_exported_at: new Date().toISOString(),
      repurposed_last_exported_at: new Date().toISOString(),
      next_export_at: new Date().toISOString(),
      export_mode: 'AUTO',
      total_export_log_count: 10,
      successful_export_log_count: 8,
      failed_export_log_count: 2,
      total_accounting_export_count: 10,
      successful_accounting_export_count: 8,
      repurposed_successful_count: 8,
      failed_accounting_export_count: 2,
      repurposed_failed_count: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      workspace: 1
    };
  }

  /**
   * Helper method to create successful accounting export summary
   */
  private static createSuccessfulAccountingExportSummary(): AccountingExportSummary {
    return {
      id: 1,
      last_exported_at: new Date().toISOString(),
      repurposed_last_exported_at: new Date().toISOString(),
      next_export_at: new Date().toISOString(),
      export_mode: 'AUTO',
      total_export_log_count: 15,
      successful_export_log_count: 15,
      failed_export_log_count: 0,
      total_accounting_export_count: 15,
      successful_accounting_export_count: 15,
      repurposed_successful_count: 15,
      failed_accounting_export_count: 0,
      repurposed_failed_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      workspace: 1
    };
  }

  /**
   * Helper method to create grouped errors
   */
  private static createGroupedErrors(): AccountingGroupedErrors {
    return {
      EMPLOYEE_MAPPING: [],
      CATEGORY_MAPPING: [],
      ACCOUNTING_ERROR: []
    };
  }

  /**
   * Creates fixture data with successful exports
   */
  static createSuccessfulExportFixtureData(): any {
    return {
      isLoading: false,
      isImportInProgress: false,
      isExportInProgress: false,
      exportableAccountingExportIds: [],
      failedExpenseGroupCount: 0,
      exportProgressPercentage: 100,
      accountingExportSummary: this.createSuccessfulAccountingExportSummary(),
      isRealTimeExportEnabled: true,
      processedCount: 10,
      errors: this.createGroupedErrors(), // No errors
      destinationFieldMap: this.createDestinationFieldMap(),
      groupedErrorStat: this.createGroupedErrorStat(), // No error stats
      isImportItemsEnabled: true,
      reimbursableImportState: ReimbursableImportState.PROCESSING,
      cccImportState: CCCImportState.APPROVED,
      importCodeFields: ['field1', 'field2'],
      chartOfAccounts: ['Account 1', 'Account 2']
    };
  }

  /**
   * Creates fixture data with integration errors
   */
  static createErrorFixtureData(): any {
    return {
      isLoading: false,
      isImportInProgress: false,
      isExportInProgress: false,
      exportableAccountingExportIds: [1, 2, 3, 4, 5],
      failedExpenseGroupCount: 7,
      exportProgressPercentage: 0,
      accountingExportSummary: this.createAccountingExportSummary(),
      isRealTimeExportEnabled: false,
      processedCount: 0,
      errors: this.createIntegrationErrors(),
      destinationFieldMap: this.createDestinationFieldMap(),
      groupedErrorStat: this.createErrorGroupedErrorStat(),
      isImportItemsEnabled: true,
      reimbursableImportState: ReimbursableImportState.PROCESSING,
      cccImportState: CCCImportState.APPROVED,
      importCodeFields: ['field1', 'field2'],
      chartOfAccounts: ['Account 1', 'Account 2']
    };
  }

  /**
   * Creates fixture data with critical errors scenario
   */
  static createCriticalErrorFixtureData(): any {
    return {
      isLoading: false,
      isImportInProgress: false,
      isExportInProgress: false,
      exportableAccountingExportIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      failedExpenseGroupCount: 10,
      exportProgressPercentage: 0,
      accountingExportSummary: this.createCriticalAccountingExportSummary(),
      isRealTimeExportEnabled: false,
      processedCount: 0,
      errors: this.createCriticalErrors(),
      destinationFieldMap: this.createDestinationFieldMap(),
      groupedErrorStat: this.createCriticalErrorGroupedErrorStat(),
      isImportItemsEnabled: true,
      reimbursableImportState: ReimbursableImportState.PROCESSING,
      cccImportState: CCCImportState.APPROVED,
      importCodeFields: ['field1', 'field2'],
      chartOfAccounts: ['Account 1', 'Account 2']
    };
  }

  /**
   * Helper method to create integration errors
   */
  private static createIntegrationErrors(): AccountingGroupedErrors {
    return {
      EMPLOYEE_MAPPING: [
        {
          id: 1,
          expense_attribute: {
            id: 1,
            attribute_type: 'EMPLOYEE',
            display_name: 'Employee',
            value: 'John Doe',
            source_id: 'emp_001',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 101,
            type: 'REPORT',
            description: {
              report_id: 'RPT_001',
              employee_name: 'John Doe',
              employee_email: 'john.doe@company.com'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'EMPLOYEE_MAPPING' as any,
          article_link: 'https://help.fylehq.com/articles/employee-mapping-errors',
          is_resolved: false,
          error_title: 'Employee Mapping Error',
          error_detail: 'Employee "John Doe" not found in QuickBooks Desktop',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        },
        {
          id: 4,
          expense_attribute: {
            id: 4,
            attribute_type: 'EMPLOYEE',
            display_name: 'Employee',
            value: 'Sarah Wilson',
            source_id: 'emp_002',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 104,
            type: 'REPORT',
            description: {
              report_id: 'RPT_004',
              employee_name: 'Sarah Wilson',
              employee_email: 'sarah.wilson@company.com'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'EMPLOYEE_MAPPING' as any,
          article_link: 'https://help.fylehq.com/articles/employee-mapping-errors',
          is_resolved: false,
          error_title: 'Employee Mapping Error',
          error_detail: 'Employee "Sarah Wilson" has invalid QuickBooks Desktop ID',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        }
      ],
      CATEGORY_MAPPING: [
        {
          id: 2,
          expense_attribute: {
            id: 2,
            attribute_type: 'CATEGORY',
            display_name: 'Category',
            value: 'Travel',
            source_id: 'cat_001',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 102,
            type: 'REPORT',
            description: {
              report_id: 'RPT_002',
              category_name: 'Travel',
              category_code: 'TRAVEL'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'CATEGORY_MAPPING' as any,
          article_link: 'https://help.fylehq.com/articles/category-mapping-errors',
          is_resolved: false,
          error_title: 'Category Mapping Error',
          error_detail: 'Category "Travel" not found in QuickBooks Desktop chart of accounts',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        },
        {
          id: 5,
          expense_attribute: {
            id: 5,
            attribute_type: 'CATEGORY',
            display_name: 'Category',
            value: 'Meals & Entertainment',
            source_id: 'cat_002',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 105,
            type: 'REPORT',
            description: {
              report_id: 'RPT_005',
              category_name: 'Meals & Entertainment',
              category_code: 'MEALS'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'CATEGORY_MAPPING' as any,
          article_link: 'https://help.fylehq.com/articles/category-mapping-errors',
          is_resolved: false,
          error_title: 'Category Mapping Error',
          error_detail: 'Category "Meals & Entertainment" account is inactive in QuickBooks Desktop',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        }
      ],
      ACCOUNTING_ERROR: [
        {
          id: 3,
          expense_attribute: {
            id: 3,
            attribute_type: 'AMOUNT',
            display_name: 'Amount',
            value: '150.00',
            source_id: 'amt_001',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 103,
            type: 'REPORT',
            description: {
              report_id: 'RPT_003',
              total_amount: 150.00,
              currency: 'USD'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'ACCOUNTING_ERROR' as any,
          article_link: 'https://help.fylehq.com/articles/accounting-errors',
          is_resolved: false,
          error_title: 'QuickBooks Desktop Connection Error',
          error_detail: 'QuickBooks Desktop connection timeout during export',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        },
        {
          id: 6,
          expense_attribute: {
            id: 6,
            attribute_type: 'VENDOR',
            display_name: 'Vendor',
            value: 'ABC Hotel',
            source_id: 'ven_001',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 106,
            type: 'REPORT',
            description: {
              report_id: 'RPT_006',
              vendor_name: 'ABC Hotel',
              total_amount: 250.00,
              currency: 'USD'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'ACCOUNTING_ERROR' as any,
          article_link: 'https://help.fylehq.com/articles/accounting-errors',
          is_resolved: false,
          error_title: 'QuickBooks Desktop Validation Error',
          error_detail: 'Vendor "ABC Hotel" has invalid tax settings in QuickBooks Desktop',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        },
        {
          id: 7,
          expense_attribute: {
            id: 7,
            attribute_type: 'PROJECT',
            display_name: 'Project',
            value: 'Project Alpha',
            source_id: 'proj_001',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 107,
            type: 'REPORT',
            description: {
              report_id: 'RPT_007',
              project_name: 'Project Alpha',
              total_amount: 500.00,
              currency: 'USD'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'ACCOUNTING_ERROR' as any,
          article_link: 'https://help.fylehq.com/articles/accounting-errors',
          is_resolved: false,
          error_title: 'QuickBooks Desktop Permission Error',
          error_detail: 'Insufficient permissions to create journal entry in QuickBooks Desktop',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        }
      ]
    };
  }

  /**
   * Helper method to create error grouped error stat
   */
  private static createErrorGroupedErrorStat(): AccountingGroupedErrorStat {
    return {
      EMPLOYEE_MAPPING: {
        resolvedCount: 0,
        totalCount: 2
      },
      CATEGORY_MAPPING: {
        resolvedCount: 0,
        totalCount: 2
      }
    };
  }

  /**
   * Helper method to create destination field map
   */
  private static createDestinationFieldMap(): DestinationFieldMap {
    return {
      EMPLOYEE: 'VENDOR',
      CATEGORY: 'ACCOUNT'
    };
  }

  /**
   * Helper method to create grouped error stat
   */
  private static createGroupedErrorStat(): AccountingGroupedErrorStat {
    return {
      EMPLOYEE_MAPPING: null,
      CATEGORY_MAPPING: null
    };
  }

  /**
   * Helper method to create critical accounting export summary
   */
  private static createCriticalAccountingExportSummary(): AccountingExportSummary {
    return {
      id: 1,
      last_exported_at: new Date().toISOString(),
      repurposed_last_exported_at: new Date().toISOString(),
      next_export_at: new Date().toISOString(),
      export_mode: 'AUTO',
      total_export_log_count: 20,
      successful_export_log_count: 5,
      failed_export_log_count: 15,
      total_accounting_export_count: 20,
      successful_accounting_export_count: 5,
      repurposed_successful_count: 5,
      failed_accounting_export_count: 15,
      repurposed_failed_count: 15,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      workspace: 1
    };
  }

  /**
   * Helper method to create critical errors
   */
  private static createCriticalErrors(): AccountingGroupedErrors {
    return {
      EMPLOYEE_MAPPING: [
        {
          id: 8,
          expense_attribute: {
            id: 8,
            attribute_type: 'EMPLOYEE',
            display_name: 'Employee',
            value: 'Michael Brown',
            source_id: 'emp_003',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 108,
            type: 'REPORT',
            description: {
              report_id: 'RPT_008',
              employee_name: 'Michael Brown',
              employee_email: 'michael.brown@company.com'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'EMPLOYEE_MAPPING' as any,
          article_link: 'https://help.fylehq.com/articles/employee-mapping-errors',
          is_resolved: false,
          error_title: 'Employee Mapping Error',
          error_detail: 'Employee "Michael Brown" is deactivated in QuickBooks Desktop',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        }
      ],
      CATEGORY_MAPPING: [
        {
          id: 9,
          expense_attribute: {
            id: 9,
            attribute_type: 'CATEGORY',
            display_name: 'Category',
            value: 'Software Licenses',
            source_id: 'cat_003',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 109,
            type: 'REPORT',
            description: {
              report_id: 'RPT_009',
              category_name: 'Software Licenses',
              category_code: 'SOFTWARE'
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'CATEGORY_MAPPING' as any,
          article_link: 'https://help.fylehq.com/articles/category-mapping-errors',
          is_resolved: false,
          error_title: 'Category Mapping Error',
          error_detail: 'Category "Software Licenses" requires approval in QuickBooks Desktop',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        }
      ],
      ACCOUNTING_ERROR: [
        {
          id: 10,
          expense_attribute: {
            id: 10,
            attribute_type: 'CURRENCY',
            display_name: 'Currency',
            value: 'EUR',
            source_id: 'curr_001',
            auto_mapped: false,
            auto_created: false,
            active: true,
            detail: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          expense_group: {
            id: 110,
            type: 'REPORT',
            description: {
              report_id: 'RPT_010',
              currency: 'EUR',
              total_amount: 1000.00
            } as any,
            status: 'FAILED' as any,
            mapping_errors: [],
            response: null,
            exported_at: null,
            export_url: null,
            expenses: [],
            fund_source: null,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1
          } as any,
          type: 'ACCOUNTING_ERROR' as any,
          article_link: 'https://help.fylehq.com/articles/accounting-errors',
          is_resolved: false,
          error_title: 'QuickBooks Desktop Currency Error',
          error_detail: 'Currency "EUR" is not supported in QuickBooks Desktop configuration',
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1
        }
      ]
    };
  }

  /**
   * Helper method to create critical error grouped error stat
   */
  private static createCriticalErrorGroupedErrorStat(): AccountingGroupedErrorStat {
    return {
      EMPLOYEE_MAPPING: {
        resolvedCount: 0,
        totalCount: 3
      },
      CATEGORY_MAPPING: {
        resolvedCount: 0,
        totalCount: 3
      }
    };
  }
}

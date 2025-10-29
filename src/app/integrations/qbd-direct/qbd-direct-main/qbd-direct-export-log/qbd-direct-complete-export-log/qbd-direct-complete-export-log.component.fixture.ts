import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { QbdDirectCompleteExportLogComponent } from './qbd-direct-complete-export-log.component';
import {
  AccountingExportList,
  AccountingExport
} from 'src/app/core/models/db/accounting-export.model';
import {
  ExpenseGroupResponse,
  ExpenseGroup
} from 'src/app/core/models/db/expense-group.model';
import {
  Expense
} from 'src/app/core/models/intacct/db/expense.model';
import {
  AppName,
  FundSource,
  TaskLogState
} from 'src/app/core/models/enum/enum.model';

export class QbdDirectCompleteExportLogComponentFixture {

  /**
   * Creates a basic component fixture with successful export logs
   */
  static createBasicComponentFixture(): ComponentFixture<QbdDirectCompleteExportLogComponent> {
    const fixture = TestBed.createComponent(QbdDirectCompleteExportLogComponent);
    const component = fixture.componentInstance;

    // Set component properties with successful export data
    component.isLoading = false;
    component.totalCount = 15;
    component.limit = 10;
    component.offset = 0;
    component.currentPage = 1;
    component.accountingExports = this.createSuccessfulAccountingExports();
    component.filteredAccountingExports = this.createSuccessfulAccountingExports();
    component.expenses = this.createExpenses();
    component.isDateSelected = false;
    component.searchQuery = null;

    return fixture;
  }

  /**
   * Creates fixture data with successful export logs
   */
  static createSuccessfulExportLogFixtureData(): any {
    return {
      isLoading: false,
      totalCount: 15,
      limit: 10,
      offset: 0,
      currentPage: 1,
      accountingExports: this.createSuccessfulAccountingExports(),
      filteredAccountingExports: this.createSuccessfulAccountingExports(),
      expenses: this.createExpenses(),
      isDateSelected: false,
      searchQuery: null
    };
  }

  /**
   * Helper method to create successful accounting exports
   */
  private static createSuccessfulAccountingExports(): AccountingExportList[] {
    return [
      {
        exportedAt: new Date('2024-01-15T10:30:00Z'),
        employee: ['John Doe', 'john.doe@company.com'],
        expenseType: 'Business Travel',
        referenceNumber: 'EXP-001',
        exportedAs: 'Bill',
        integrationUrl: 'https://qbd.company.com/bill/123',
        fyleUrl: 'https://fyle.app/expense/456',
        expenses: this.createExpenses()
      },
      {
        exportedAt: new Date('2024-01-15T11:45:00Z'),
        employee: ['Jane Smith', 'jane.smith@company.com'],
        expenseType: 'Office Supplies',
        referenceNumber: 'EXP-002',
        exportedAs: 'Credit Card Purchase',
        integrationUrl: 'https://qbd.company.com/ccp/124',
        fyleUrl: 'https://fyle.app/expense/457',
        expenses: this.createExpenses()
      },
      {
        exportedAt: new Date('2024-01-15T14:20:00Z'),
        employee: ['Mike Johnson', 'mike.johnson@company.com'],
        expenseType: 'Client Meeting',
        referenceNumber: 'EXP-003',
        exportedAs: 'Journal Entry',
        integrationUrl: 'https://qbd.company.com/je/125',
        fyleUrl: 'https://fyle.app/expense/458',
        expenses: this.createExpenses()
      }
    ];
  }

  /**
   * Helper method to create expenses
   */
  private static createExpenses(): Expense[] {
    return [
      {
          id: 2,
          employee_name: 'John Doe',
          employee_email: 'john.doe@company.com',
          category: 'Travel',
          sub_category: 'Hotel',
          project: 'Project Alpha',
          cost_center: 'Engineering',
          amount: 200.00,
          currency: 'USD',
          // Expense_date: new Date('2024-01-11'),
          created_at: new Date('2024-01-11T10:00:00Z'),
          updated_at: '2024-01-11T10:00:00Z',
          org_id: '1',          // Workspace: 1

          expense_id: '',
          expense_number: 'qdede2',
          claim_number: 'cdcdcdcdcc',
          foreign_amount: 0,
          foreign_currency: '',
          tax_amount: 0,
          tax_group_id: '',
          settlement_id: '',
          reimbursable: false,
          billable: false,
          state: '',
          vendor: '',
          purpose: '',
          report_id: '',
          spent_at: '2024-01-11T10:00:00Z',
          approved_at: new Date('2024-01-11T10:00:00Z'),
          posted_at: new Date('2024-01-11T10:00:00Z'),
          expense_created_at: new Date('2024-01-11T10:00:00Z'),
          expense_updated_at: new Date('2024-01-11T10:00:00Z'),
          fund_source: 'PERSONAL',
          verified_at: new Date('2024-01-11T10:00:00Z'),
          custom_properties: [],
          paid_on_sage_intacct: false,
          file_ids: [],
          payment_number: '',
          corporate_card_id: '',
          is_skipped: false,
          report_title: ''
      }
    ];
  }
}

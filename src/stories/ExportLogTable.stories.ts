
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TableModule } from 'primeng/table';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { ExportLogTableComponent } from 'src/app/shared/components/export-log/export-log-table/export-log-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<ExportLogTableComponent> = {
  title: 'ExportLog/ExportLogTable',
  component: ExportLogTableComponent,
  tags: ['autodocs'],
  render: (args: ExportLogTableComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, BrowserAnimationsModule, TableModule, SharedModule, ]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ExportLogTableComponent>;

export const simple: Story = {
  args: {
    filteredExpenseGroups: [
      {
        exportedAt: new Date(),
        employee: ['Ashwin', 'ashwin.t@fyle.in'],
        expenseType: 'Reimbursable',
        referenceNumber: 'E/2020/05/28',
        exportedAs: 'Bill',
        integrationUrl: 'https://www.fylehq.com',
        fyleUrl: 'https://www.fylehq.com',
        expenses: [
          {
            id: 1,
            employee_email: 'ashwin.t@fyle.in',
            employee_name: 'Ashwin',
            category: 'Travel',
            sub_category: 'Travel',
            project: 'Fyle',
            expense_id: '1',
            org_id: '1',
            expense_number: 'E/2020/05/28',
            claim_number: 'C/2020/05/28',
            amount: 100,
            currency: 'INR',
            foreign_amount: 100,
            foreign_currency: 'INR',
            tax_amount: 0,
            tax_group_id: '1',
            settlement_id: '1',
            reimbursable: true,
            billable: false,
            state: 'COMPLETE',
            vendor: 'Fyle',
            cost_center: 'Fyle',
            purpose: 'Fyle',
            report_id: '1',
            spent_at: new Date(),
            approved_at: new Date(),
            posted_at: new Date(),
            expense_created_at: new Date(),
            expense_updated_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
            fund_source: 'Personal Funds',
            verified_at: new Date(),
            custom_properties: [],
            paid_on_sage_intacct: true,
            file_ids: [],
            payment_number: '1',
            corporate_card_id: '1',
            is_skipped: false,
            report_title: 'Fyle'
          }
        ]
      }
    ],
    appName: AppName.QBO,
    isExportLogTable: true,
    isDashboardFailed: false
  }
};

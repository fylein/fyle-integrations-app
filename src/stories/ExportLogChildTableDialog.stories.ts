import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ExportLogChildTableDialogComponent } from 'src/app/shared/components/export-log/export-log-dialog/export-log-child-table-dialog.component';

const meta: Meta<ExportLogChildTableDialogComponent> = {
  title: 'ExportLog/ExportLogChildTableDialog',
  component: ExportLogChildTableDialogComponent,
  tags: ['autodocs'],
  render: (args: ExportLogChildTableDialogComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ExportLogChildTableDialogComponent],
      imports: [CommonModule, DialogModule, BrowserAnimationsModule, TableModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ExportLogChildTableDialogComponent>;

export const simple: Story = {
  args: {
    isDialogOpen: true,
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
        report_title: 'Fyle',
      },
    ],
  },
};

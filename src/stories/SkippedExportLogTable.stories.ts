import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TableModule } from 'primeng/table';
import { SkippedExportLogTableComponent } from 'src/app/shared/components/export-log/skipped-export-log-table/skipped-export-log-table.component';

const meta: Meta<SkippedExportLogTableComponent> = {
  title: 'ExportLog/SkippedExportLogTable',
  component: SkippedExportLogTableComponent,
  tags: ['autodocs'],
  render: (args: SkippedExportLogTableComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [SkippedExportLogTableComponent],
      imports: [CommonModule, TableModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<SkippedExportLogTableComponent>;

export const simple: Story = {
  args: {
    filteredExpense: [
      {
        updated_at: new Date(),
        employee: ['Ashwin', 'ashwin.t@fyle.in'],
        expenseType: 'Reimbursable',
        claim_number: 'C/2020/05/28',
        fyleUrl: 'https://www.fylehq.com',
      },
    ],
  },
};

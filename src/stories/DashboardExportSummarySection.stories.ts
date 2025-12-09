import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AppName, QBOTaskLogType } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { ApiService } from 'src/app/core/services/common/api.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { DashboardExportSummarySectionComponent } from 'src/app/shared/components/dashboard/dashboard-export-summary-section/dashboard-export-summary-section.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<DashboardExportSummarySectionComponent> = {
  title: 'Dashboard/DashboardExportSummarySection',
  component: DashboardExportSummarySectionComponent,
  tags: ['autodocs'],
  render: (args: DashboardExportSummarySectionComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SharedModule],
      providers: [
        {
          provide: AccountingExportService,
          useValue: {},
        },
        {
          provide: ApiService,
          useValue: {},
        },
        {
          provide: HttpClient,
          useValue: {},
        },
        {
          provide: ExportLogService,
          useValue: {},
        },
      ],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<DashboardExportSummarySectionComponent>;

export const simple: Story = {
  args: {
    appName: AppName.QBO,
    exportLogVersion: 'v1',
    accountingExportType: [
      QBOTaskLogType.FETCHING_EXPENSE,
      QBOTaskLogType.CREATING_BILL,
      QBOTaskLogType.CREATING_EXPENSE,
      QBOTaskLogType.CREATING_CHECK,
      QBOTaskLogType.CREATING_CREDIT_CARD_PURCHASE,
      QBOTaskLogType.CREATING_JOURNAL_ENTRY,
      QBOTaskLogType.CREATING_CREDIT_CARD_CREDIT,
      QBOTaskLogType.CREATING_DEBIT_CARD_EXPENSE,
    ],
    accountingExportSummary: {
      id: 1,
      last_exported_at: '2021-09-01T08:00:00Z',
      next_export_at: '2021-09-01T08:00:00Z',
      export_mode: 'AUTO',
      total_accounting_export_count: 1,
      successful_accounting_export_count: 1,
      failed_accounting_export_count: 0,
      created_at: '2021-09-01T08:00:00Z',
      updated_at: '2021-09-01T08:00:00Z',
      workspace: 1,
    },
  },
};

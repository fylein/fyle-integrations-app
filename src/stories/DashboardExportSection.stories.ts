
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { AppName, LoaderType } from 'src/app/core/models/enum/enum.model';
import { DashboardExportSectionComponent } from 'src/app/shared/components/dashboard/dashboard-export-section/dashboard-export-section.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<DashboardExportSectionComponent> = {
  title: 'Dashboard/DashboardExportSection',
  component: DashboardExportSectionComponent,
  tags: ['autodocs'],
  render: (args: DashboardExportSectionComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SharedModule, ProgressBarModule, TooltipModule, ]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardExportSectionComponent>;

export const readyState: Story = {
  args: {
    appName: AppName.QBO,
    isImportInProgress: false,
    isExportInProgress: false,
    exportableAccountingExportIds: [0],
    failedExpenseGroupCount: 0,
    exportProgressPercentage: 0,
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
      workspace: 1
    },
    processedCount: 0
  }
};

export const exportInProgress: Story = {
  args: {
    appName: AppName.QBO,
    loaderType: LoaderType.INDETERMINATE,
    isImportInProgress: false,
    isExportInProgress: true,
    exportableAccountingExportIds: [1, 2, 3],
    failedExpenseGroupCount: 0,
    exportProgressPercentage: 50,
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
      workspace: 1
    },
    processedCount: 1
  }
};

export const importInProgress: Story = {
  args: {
    appName: AppName.QBO,
    loaderType: LoaderType.INDETERMINATE,
    isImportInProgress: true,
    isExportInProgress: false,
    exportableAccountingExportIds: [1, 2, 3],
    failedExpenseGroupCount: 0,
    exportProgressPercentage: 50,
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
      workspace: 1
    },
    processedCount: 1
  }
};

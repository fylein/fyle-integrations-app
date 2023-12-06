
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DashboardExportLogDialogComponent } from 'src/app/shared/components/dashboard/dashboard-export-log-dialog/dashboard-export-log-dialog.component';

const meta: Meta<DashboardExportLogDialogComponent> = {
  title: 'Components/DashboardExportLogDialog',
  component: DashboardExportLogDialogComponent,
  tags: ['autodocs'],
  render: (args: DashboardExportLogDialogComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DashboardExportLogDialogComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardExportLogDialogComponent>;

export const simple: Story = {};

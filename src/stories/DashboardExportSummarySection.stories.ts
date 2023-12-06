
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DashboardExportSummarySectionComponent } from 'src/app/shared/components/dashboard/dashboard-export-summary-section/dashboard-export-summary-section.component';

const meta: Meta<DashboardExportSummarySectionComponent> = {
  title: 'Components/DashboardExportSummarySection',
  component: DashboardExportSummarySectionComponent,
  tags: ['autodocs'],
  render: (args: DashboardExportSummarySectionComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DashboardExportSummarySectionComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardExportSummarySectionComponent>;

export const simple: Story = {};

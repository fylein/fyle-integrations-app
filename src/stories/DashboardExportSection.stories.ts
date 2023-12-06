
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DashboardExportSectionComponent } from 'src/app/shared/components/dashboard/dashboard-export-section/dashboard-export-section.component';

const meta: Meta<DashboardExportSectionComponent> = {
  title: 'Components/DashboardExportSection',
  component: DashboardExportSectionComponent,
  tags: ['autodocs'],
  render: (args: DashboardExportSectionComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DashboardExportSectionComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardExportSectionComponent>;

export const simple: Story = {};

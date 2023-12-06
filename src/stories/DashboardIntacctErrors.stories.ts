
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DashboardIntacctErrorsComponent } from 'src/app/shared/components/si/helper/dashboard-intacct-errors/dashboard-intacct-errors.component';

const meta: Meta<DashboardIntacctErrorsComponent> = {
  title: 'Components/DashboardIntacctErrors',
  component: DashboardIntacctErrorsComponent,
  tags: ['autodocs'],
  render: (args: DashboardIntacctErrorsComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DashboardIntacctErrorsComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardIntacctErrorsComponent>;

export const simple: Story = {};

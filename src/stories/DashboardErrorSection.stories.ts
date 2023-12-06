
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DashboardErrorSectionComponent } from 'src/app/shared/components/dashboard/dashboard-error-section/dashboard-error-section.component';

const meta: Meta<DashboardErrorSectionComponent> = {
  title: 'Components/DashboardErrorSection',
  component: DashboardErrorSectionComponent,
  tags: ['autodocs'],
  render: (args: DashboardErrorSectionComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DashboardErrorSectionComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardErrorSectionComponent>;

export const simple: Story = {};

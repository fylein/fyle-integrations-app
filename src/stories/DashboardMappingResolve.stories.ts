
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DashboardMappingResolveComponent } from 'src/app/shared/components/si/helper/dashboard-mapping-resolve/dashboard-mapping-resolve.component';

const meta: Meta<DashboardMappingResolveComponent> = {
  title: 'Components/DashboardMappingResolve',
  component: DashboardMappingResolveComponent,
  tags: ['autodocs'],
  render: (args: DashboardMappingResolveComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DashboardMappingResolveComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardMappingResolveComponent>;

export const simple: Story = {};

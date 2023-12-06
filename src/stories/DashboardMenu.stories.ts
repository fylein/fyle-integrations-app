
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DashboardMenuComponent } from 'src/app/shared/components/core/dashboard-menu/dashboard-menu.component';

const meta: Meta<DashboardMenuComponent> = {
  title: 'Components/DashboardMenu',
  component: DashboardMenuComponent,
  tags: ['autodocs'],
  render: (args: DashboardMenuComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DashboardMenuComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardMenuComponent>;

export const simple: Story = {};

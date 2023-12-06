
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DashboardAccountingErrorDialogComponent } from 'src/app/shared/components/dashboard/dashboard-accounting-error-dialog/dashboard-accounting-error-dialog.component';

const meta: Meta<DashboardAccountingErrorDialogComponent> = {
  title: 'Components/DashboardAccountingErrorDialog',
  component: DashboardAccountingErrorDialogComponent,
  tags: ['autodocs'],
  render: (args: DashboardAccountingErrorDialogComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [DashboardAccountingErrorDialogComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<DashboardAccountingErrorDialogComponent>;

export const simple: Story = {};

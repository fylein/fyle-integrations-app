
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ExportLogChildTableDialogComponent } from 'src/app/shared/components/export-log/export-log-dialog/export-log-child-table-dialog.component';

const meta: Meta<ExportLogChildTableDialogComponent> = {
  title: 'Components/ExportLogChildTableDialog',
  component: ExportLogChildTableDialogComponent,
  tags: ['autodocs'],
  render: (args: ExportLogChildTableDialogComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ExportLogChildTableDialogComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ExportLogChildTableDialogComponent>;

export const simple: Story = {};


import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ExportLogTableComponent } from 'src/app/shared/components/export-log/export-log-table/export-log-table.component';

const meta: Meta<ExportLogTableComponent> = {
  title: 'Components/ExportLogTable',
  component: ExportLogTableComponent,
  tags: ['autodocs'],
  render: (args: ExportLogTableComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ExportLogTableComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ExportLogTableComponent>;

export const simple: Story = {};


import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { SkippedExportLogTableComponent } from 'src/app/shared/components/export-log/skipped-export-log-table/skipped-export-log-table.component';

const meta: Meta<SkippedExportLogTableComponent> = {
  title: 'Components/SkippedExportLogTable',
  component: SkippedExportLogTableComponent,
  tags: ['autodocs'],
  render: (args: SkippedExportLogTableComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [SkippedExportLogTableComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<SkippedExportLogTableComponent>;

export const simple: Story = {};

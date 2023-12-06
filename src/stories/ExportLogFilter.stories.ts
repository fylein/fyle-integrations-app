
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ExportLogFilterComponent } from 'src/app/shared/components/export-log/export-log-filter/export-log-filter.component';

const meta: Meta<ExportLogFilterComponent> = {
  title: 'Components/ExportLogFilter',
  component: ExportLogFilterComponent,
  tags: ['autodocs'],
  render: (args: ExportLogFilterComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ExportLogFilterComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ExportLogFilterComponent>;

export const simple: Story = {};

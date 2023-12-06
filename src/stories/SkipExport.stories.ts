
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SkipExportComponent } from 'src/app/shared/components/si/helper/skip-export/skip-export.component';

const meta: Meta<SkipExportComponent> = {
  title: 'Components/SkipExport',
  component: SkipExportComponent,
  tags: ['autodocs'],
  render: (args: SkipExportComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [SkipExportComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<SkipExportComponent>;

export const simple: Story = {};

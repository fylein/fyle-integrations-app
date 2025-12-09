import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationSkipExportComponent } from 'src/app/shared/components/configuration/configuration-skip-export/configuration-skip-export.component';

const meta: Meta<ConfigurationSkipExportComponent> = {
  title: 'Configuration/AdvancedSetting/ConfigurationSkipExport',
  component: ConfigurationSkipExportComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationSkipExportComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationSkipExportComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationSkipExportComponent>;

export const simple: Story = {};

import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { brandingConfig } from 'src/app/branding/branding-config';
import { ConfigurationStepSubHeaderComponent } from 'src/app/shared/components/configuration/configuration-step-sub-header/configuration-step-sub-header.component';

const meta: Meta<ConfigurationStepSubHeaderComponent> = {
  title: 'Configuration/AdvancedSetting/ConfigurationStepSubHeader',
  component: ConfigurationStepSubHeaderComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationStepSubHeaderComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationStepSubHeaderComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationStepSubHeaderComponent>;

export const simple: Story = {
  args: {
    label: 'Other Preferences',
    subLabel:
      'Based on your preference, you can choose whether you want to create any new records in QuickBooks Online from ' +
      brandingConfig.brandName +
      '. (when there is no employee record found, or when the accounting period is closed)',
  },
};

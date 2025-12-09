import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { brandingConfig } from 'src/app/branding/branding-config';
import { ConfigurationInfoLabelComponent } from 'src/app/shared/components/configuration/configuration-info-label/configuration-info-label.component';

const meta: Meta<ConfigurationInfoLabelComponent> = {
  title: 'Configuration/ImportSetting/ConfigurationInfoLabel',
  component: ConfigurationInfoLabelComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationInfoLabelComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationInfoLabelComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationInfoLabelComponent>;

export const simple: Story = {
  args: {
    infoText:
      "If you'd like to use only selective data from Sage Intacct, map a Sage Intacct dimension to a field in " +
      brandingConfig.brandName +
      ' and turn off the import, as importing the data will sync in all the active values in Sage Intacct. You can add the required values in ' +
      brandingConfig.brandName +
      ' and map them later in the integration mapping section.',
  },
};

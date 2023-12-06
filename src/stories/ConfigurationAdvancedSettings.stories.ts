
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ConfigurationAdvancedSettingsComponent } from 'src/app/shared/components/si/configuration/configuration-advanced-settings/configuration-advanced-settings.component';

const meta: Meta<ConfigurationAdvancedSettingsComponent> = {
  title: 'Components/ConfigurationAdvancedSettings',
  component: ConfigurationAdvancedSettingsComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationAdvancedSettingsComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationAdvancedSettingsComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationAdvancedSettingsComponent>;

export const simple: Story = {};

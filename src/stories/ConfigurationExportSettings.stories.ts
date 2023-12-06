
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ConfigurationExportSettingsComponent } from 'src/app/shared/components/si/configuration/configuration-export-settings/configuration-export-settings.component';

const meta: Meta<ConfigurationExportSettingsComponent> = {
  title: 'Components/ConfigurationExportSettings',
  component: ConfigurationExportSettingsComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationExportSettingsComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationExportSettingsComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationExportSettingsComponent>;

export const simple: Story = {};

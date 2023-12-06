
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ConfigurationImportSettingsComponent } from 'src/app/shared/components/si/configuration/configuration-import-settings/configuration-import-settings.component';

const meta: Meta<ConfigurationImportSettingsComponent> = {
  title: 'Components/ConfigurationImportSettings',
  component: ConfigurationImportSettingsComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationImportSettingsComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationImportSettingsComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationImportSettingsComponent>;

export const simple: Story = {};

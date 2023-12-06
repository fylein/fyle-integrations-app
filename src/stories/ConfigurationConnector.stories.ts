
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationConnectorComponent } from 'src/app/shared/components/configuration/configuration-connector/configuration-connector.component';

const meta: Meta<ConfigurationConnectorComponent> = {
  title: 'Components/ConfigurationConnector',
  component: ConfigurationConnectorComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationConnectorComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationConnectorComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationConnectorComponent>;

export const simple: Story = {};

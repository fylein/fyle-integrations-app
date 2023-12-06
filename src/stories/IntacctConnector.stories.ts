
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { IntacctConnectorComponent } from 'src/app/shared/components/si/core/intacct-connector/intacct-connector.component';

const meta: Meta<IntacctConnectorComponent> = {
  title: 'Components/IntacctConnector',
  component: IntacctConnectorComponent,
  tags: ['autodocs'],
  render: (args: IntacctConnectorComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [IntacctConnectorComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<IntacctConnectorComponent>;

export const simple: Story = {};

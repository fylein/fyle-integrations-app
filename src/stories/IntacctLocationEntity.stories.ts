
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { IntacctLocationEntityComponent } from 'src/app/shared/components/si/core/intacct-location-entity/intacct-location-entity.component';

const meta: Meta<IntacctLocationEntityComponent> = {
  title: 'Components/IntacctLocationEntity',
  component: IntacctLocationEntityComponent,
  tags: ['autodocs'],
  render: (args: IntacctLocationEntityComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [IntacctLocationEntityComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<IntacctLocationEntityComponent>;

export const simple: Story = {};

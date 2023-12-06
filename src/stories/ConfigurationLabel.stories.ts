
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationLabelComponent } from 'src/app/shared/components/qbd/configuration/configuration-label/configuration-label.component';

const meta: Meta<ConfigurationLabelComponent> = {
  title: 'Components/ConfigurationLabel',
  component: ConfigurationLabelComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationLabelComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationLabelComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationLabelComponent>;

export const simple: Story = {};

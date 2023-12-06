
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationRadioFieldComponent } from 'src/app/shared/components/qbd/configuration/configuration-radio-field/configuration-radio-field.component';

const meta: Meta<ConfigurationRadioFieldComponent> = {
  title: 'Components/ConfigurationRadioField',
  component: ConfigurationRadioFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationRadioFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationRadioFieldComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationRadioFieldComponent>;

export const simple: Story = {};

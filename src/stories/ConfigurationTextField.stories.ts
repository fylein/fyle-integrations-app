
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ConfigurationTextFieldComponent } from 'src/app/shared/components/configuration/configuration-text-field/configuration-text-field.component';

const meta: Meta<ConfigurationTextFieldComponent> = {
  title: 'Components/ConfigurationTextField',
  component: ConfigurationTextFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationTextFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationTextFieldComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationTextFieldComponent>;

export const simple: Story = {};

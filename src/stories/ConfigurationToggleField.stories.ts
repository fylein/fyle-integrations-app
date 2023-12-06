
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationToggleFieldComponent } from 'src/app/shared/components/configuration/configuration-toggle-field/configuration-toggle-field.component';

const meta: Meta<ConfigurationToggleFieldComponent> = {
  title: 'Components/ConfigurationToggleField',
  component: ConfigurationToggleFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationToggleFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationToggleFieldComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationToggleFieldComponent>;

export const simple: Story = {};

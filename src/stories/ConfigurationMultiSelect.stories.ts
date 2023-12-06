
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationMultiSelectComponent } from 'src/app/shared/components/configuration/configuration-multi-select/configuration-multi-select.component';

const meta: Meta<ConfigurationMultiSelectComponent> = {
  title: 'Components/ConfigurationMultiSelect',
  component: ConfigurationMultiSelectComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationMultiSelectComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationMultiSelectComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationMultiSelectComponent>;

export const simple: Story = {};

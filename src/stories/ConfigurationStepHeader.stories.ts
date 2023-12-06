
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationStepHeaderComponent } from 'src/app/shared/components/configuration/configuration-step-header/configuration-step-header.component';

const meta: Meta<ConfigurationStepHeaderComponent> = {
  title: 'Components/ConfigurationStepHeader',
  component: ConfigurationStepHeaderComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationStepHeaderComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationStepHeaderComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationStepHeaderComponent>;

export const simple: Story = {};


import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationStepSubHeaderComponent } from 'src/app/shared/components/configuration/configuration-step-sub-header/configuration-step-sub-header.component';

const meta: Meta<ConfigurationStepSubHeaderComponent> = {
  title: 'Components/ConfigurationStepSubHeader',
  component: ConfigurationStepSubHeaderComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationStepSubHeaderComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationStepSubHeaderComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationStepSubHeaderComponent>;

export const simple: Story = {};

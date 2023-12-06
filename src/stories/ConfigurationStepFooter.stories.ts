
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationStepFooterComponent } from 'src/app/shared/components/configuration/configuration-step-footer/configuration-step-footer.component';

const meta: Meta<ConfigurationStepFooterComponent> = {
  title: 'Components/ConfigurationStepFooter',
  component: ConfigurationStepFooterComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationStepFooterComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationStepFooterComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationStepFooterComponent>;

export const simple: Story = {};

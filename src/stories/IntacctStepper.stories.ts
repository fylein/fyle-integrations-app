
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { IntacctStepperComponent } from 'src/app/shared/components/si/helper/intacct-stepper/intacct-stepper.component';

const meta: Meta<IntacctStepperComponent> = {
  title: 'Components/IntacctStepper',
  component: IntacctStepperComponent,
  tags: ['autodocs'],
  render: (args: IntacctStepperComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [IntacctStepperComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<IntacctStepperComponent>;

export const simple: Story = {};

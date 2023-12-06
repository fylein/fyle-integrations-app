
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OnboardingStepperComponent } from 'src/app/shared/components/qbd/helper/onboarding-stepper/onboarding-stepper.component';

const meta: Meta<OnboardingStepperComponent> = {
  title: 'Components/OnboardingStepper',
  component: OnboardingStepperComponent,
  tags: ['autodocs'],
  render: (args: OnboardingStepperComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [OnboardingStepperComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<OnboardingStepperComponent>;

export const simple: Story = {};

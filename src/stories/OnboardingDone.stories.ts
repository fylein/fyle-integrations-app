import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OnboardingDoneComponent } from 'src/app/shared/components/helper/onboarding-done/onboarding-done.component';

const meta: Meta<OnboardingDoneComponent> = {
  title: 'Onboarding/OnboardingDone',
  component: OnboardingDoneComponent,
  tags: ['autodocs'],
  render: (args: OnboardingDoneComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [OnboardingDoneComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<OnboardingDoneComponent>;

export const simple: Story = {};

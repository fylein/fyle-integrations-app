import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { ConfigurationStepFooterComponent } from 'src/app/shared/components/configuration/configuration-step-footer/configuration-step-footer.component';

const meta: Meta<ConfigurationStepFooterComponent> = {
  title: 'Configuration/ConfigurationStepFooter',
  component: ConfigurationStepFooterComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationStepFooterComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationStepFooterComponent],
      imports: [CommonModule, ButtonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationStepFooterComponent>;

export const enabledButton: Story = {
  args: {
    ctaText: 'Save and Continue',
    isButtonDisabled: false,
    showBackButton: true,
    showResetButton: true,
  },
};

export const disabledButton: Story = {
  args: {
    ctaText: 'Save and Continue',
    isButtonDisabled: true,
  },
};

export const loaderButton: Story = {
  args: {
    ctaText: 'Saving',
    isButtonDisabled: true,
  },
};

import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MandatoryErrorMessageComponent } from 'src/app/shared/components/helper/mandatory-error-message/mandatory-error-message.component';

const meta: Meta<MandatoryErrorMessageComponent> = {
  title: 'Core/MandatoryErrorMessage',
  component: MandatoryErrorMessageComponent,
  tags: ['autodocs'],
  render: (args: MandatoryErrorMessageComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [MandatoryErrorMessageComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<MandatoryErrorMessageComponent>;

export const simple: Story = {
  args: {
    listName: 'project',
  },
};

export const project: Story = {
  args: {
    customErrorMessage: 'Project is mandatory',
  },
};

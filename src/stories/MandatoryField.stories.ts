import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MandatoryFieldComponent } from 'src/app/shared/components/helper/mandatory-field/mandatory-field.component';

const meta: Meta<MandatoryFieldComponent> = {
  title: 'Core/MandatoryField',
  component: MandatoryFieldComponent,
  tags: ['autodocs'],
  render: (args: MandatoryFieldComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [MandatoryFieldComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<MandatoryFieldComponent>;

export const simple: Story = {};

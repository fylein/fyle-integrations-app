
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { MandatoryFieldComponent } from 'src/app/shared/components/helper/mandatory-field/mandatory-field.component';

const meta: Meta<MandatoryFieldComponent> = {
  title: 'Components/MandatoryField',
  component: MandatoryFieldComponent,
  tags: ['autodocs'],
  render: (args: MandatoryFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [MandatoryFieldComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<MandatoryFieldComponent>;

export const simple: Story = {};

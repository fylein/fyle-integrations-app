
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { EmailMultiSelectFieldComponent } from 'src/app/shared/components/configuration/email-multi-select-field/email-multi-select-field.component';

const meta: Meta<EmailMultiSelectFieldComponent> = {
  title: 'Components/EmailMultiSelectField',
  component: EmailMultiSelectFieldComponent,
  tags: ['autodocs'],
  render: (args: EmailMultiSelectFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [EmailMultiSelectFieldComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<EmailMultiSelectFieldComponent>;

export const simple: Story = {};

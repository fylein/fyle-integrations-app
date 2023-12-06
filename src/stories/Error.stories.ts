
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ErrorComponent } from 'src/app/shared/components/core/error/error.component';

const meta: Meta<ErrorComponent> = {
  title: 'Components/Error',
  component: ErrorComponent,
  tags: ['autodocs'],
  render: (args: ErrorComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ErrorComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ErrorComponent>;

export const simple: Story = {};

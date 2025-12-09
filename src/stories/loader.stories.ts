import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from 'src/app/shared/components/core/loader/loader.component';

const meta: Meta<LoaderComponent> = {
  title: 'Core/Loader',
  component: LoaderComponent,
  tags: ['autodocs'],
  render: (args: LoaderComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [LoaderComponent],
      imports: [CommonModule, ProgressSpinnerModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<LoaderComponent>;

export const simple: Story = {};

export const smallLoader: Story = {
  args: {
    styleClass: '!tw-w-16-px !tw-h-16-px spinner-default',
  },
};

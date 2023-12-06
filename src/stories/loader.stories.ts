import { CommonModule } from '@angular/common';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SharedModule } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from 'src/app/shared/components/core/loader/loader.component';


const meta: Meta<LoaderComponent> = {
  title: 'Core/Loader Component',
  component: LoaderComponent,
  tags: ['autodocs'],
  render: (args: LoaderComponent) => ({
    props: {
      ...args
    }
  }),
  decorators: [
    moduleMetadata({
      declarations: [LoaderComponent],
      imports: [CommonModule, SharedModule, ProgressSpinnerModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<LoaderComponent>;

export const simple: Story = {};

export const smallLoader: Story = {
  args: {
    styleClass: "!tw-w-16-px !tw-h-16-px spinner-default"
  }
};

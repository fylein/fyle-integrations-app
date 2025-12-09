import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ZeroStateComponent } from 'src/app/shared/components/helper/zero-state/zero-state.component';

const meta: Meta<ZeroStateComponent> = {
  title: 'Core/ZeroState',
  component: ZeroStateComponent,
  tags: ['autodocs'],
  render: (args: ZeroStateComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ZeroStateComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ZeroStateComponent>;

export const simple: Story = {
  args: {
    zeroStateImageURL: 'assets/icons/dashboard-illustration.svg',
    zeroStateCaption: 'There are no expenses to export at the moment!',
  },
};

import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ZeroStateWithIllustrationComponent } from 'src/app/shared/components/helper/zero-state-with-illustration/zero-state-with-illustration.component';

const meta: Meta<ZeroStateWithIllustrationComponent> = {
  title: 'Core/ZeroStateWithIllustration',
  component: ZeroStateWithIllustrationComponent,
  tags: ['autodocs'],
  render: (args: ZeroStateWithIllustrationComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ZeroStateWithIllustrationComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ZeroStateWithIllustrationComponent>;

export const simple: Story = {
  args: {
    mainText: 'Sorry, no results found!',
    subText: 'We could not find what you were looking for. Kindly check the keywords again.',
  },
};

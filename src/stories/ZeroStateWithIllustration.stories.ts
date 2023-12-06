
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ZeroStateWithIllustrationComponent } from 'src/app/shared/components/qbd/core/zero-state-with-illustration/zero-state-with-illustration.component';

const meta: Meta<ZeroStateWithIllustrationComponent> = {
  title: 'Components/ZeroStateWithIllustration',
  component: ZeroStateWithIllustrationComponent,
  tags: ['autodocs'],
  render: (args: ZeroStateWithIllustrationComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ZeroStateWithIllustrationComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ZeroStateWithIllustrationComponent>;

export const simple: Story = {};

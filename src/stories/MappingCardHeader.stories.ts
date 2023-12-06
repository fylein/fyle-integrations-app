
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MappingCardHeaderComponent } from 'src/app/shared/components/helper/mapping/mapping-card-header/mapping-card-header.component';

const meta: Meta<MappingCardHeaderComponent> = {
  title: 'Components/MappingCardHeader',
  component: MappingCardHeaderComponent,
  tags: ['autodocs'],
  render: (args: MappingCardHeaderComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [MappingCardHeaderComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<MappingCardHeaderComponent>;

export const simple: Story = {};

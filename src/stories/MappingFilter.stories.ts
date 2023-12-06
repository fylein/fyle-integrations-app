
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MappingFilterComponent } from 'src/app/shared/components/helper/mapping/mapping-filter/mapping-filter.component';

const meta: Meta<MappingFilterComponent> = {
  title: 'Components/MappingFilter',
  component: MappingFilterComponent,
  tags: ['autodocs'],
  render: (args: MappingFilterComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [MappingFilterComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<MappingFilterComponent>;

export const simple: Story = {};

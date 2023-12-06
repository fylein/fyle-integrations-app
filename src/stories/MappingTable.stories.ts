
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MappingTableComponent } from 'src/app/shared/components/qbd/mapping/mapping-table/mapping-table.component';

const meta: Meta<MappingTableComponent> = {
  title: 'Components/MappingTable',
  component: MappingTableComponent,
  tags: ['autodocs'],
  render: (args: MappingTableComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [MappingTableComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<MappingTableComponent>;

export const simple: Story = {};

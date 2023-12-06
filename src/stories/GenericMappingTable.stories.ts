
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { GenericMappingTableComponent } from 'src/app/shared/components/helper/mapping/generic-mapping-table/generic-mapping-table.component';

const meta: Meta<GenericMappingTableComponent> = {
  title: 'Components/GenericMappingTable',
  component: GenericMappingTableComponent,
  tags: ['autodocs'],
  render: (args: GenericMappingTableComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [GenericMappingTableComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<GenericMappingTableComponent>;

export const simple: Story = {};

import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MappingCardHeaderComponent } from 'src/app/shared/components/helper/mapping/mapping-card-header/mapping-card-header.component';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

const meta: Meta<MappingCardHeaderComponent> = {
  title: 'Mapping/MappingCardHeader',
  component: MappingCardHeaderComponent,
  tags: ['autodocs'],
  render: (args: MappingCardHeaderComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [MappingCardHeaderComponent, SnakeCaseToSpaceCasePipe],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<MappingCardHeaderComponent>;

export const simple: Story = {
  args: {
    sourceField: 'employee',
    showAutoMapEmployee: true,
    mappingStats: {
      all_attributes_count: 5,
      unmapped_attributes_count: 5,
    },
  },
};


import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { GenericMappingV2Component } from 'src/app/shared/components/helper/mapping/generic-mapping-v2/generic-mapping-v2.component';

const meta: Meta<GenericMappingV2Component> = {
  title: 'Components/GenericMappingV2',
  component: GenericMappingV2Component,
  tags: ['autodocs'],
  render: (args: GenericMappingV2Component) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [GenericMappingV2Component],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<GenericMappingV2Component>;

export const simple: Story = {};


import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { FieldMappingComponent } from 'src/app/shared/components/qbd/configuration/field-mapping/field-mapping.component';

const meta: Meta<FieldMappingComponent> = {
  title: 'Components/FieldMapping',
  component: FieldMappingComponent,
  tags: ['autodocs'],
  render: (args: FieldMappingComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [FieldMappingComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<FieldMappingComponent>;

export const simple: Story = {};

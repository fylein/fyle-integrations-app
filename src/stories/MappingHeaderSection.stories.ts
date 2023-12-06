
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { MappingHeaderSectionComponent } from 'src/app/shared/components/qbd/mapping/mapping-header-section/mapping-header-section.component';

const meta: Meta<MappingHeaderSectionComponent> = {
  title: 'Components/MappingHeaderSection',
  component: MappingHeaderSectionComponent,
  tags: ['autodocs'],
  render: (args: MappingHeaderSectionComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [MappingHeaderSectionComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<MappingHeaderSectionComponent>;

export const simple: Story = {};

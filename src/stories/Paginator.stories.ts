
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { PaginatorComponent } from 'src/app/shared/components/helper/paginator/paginator.component';

const meta: Meta<PaginatorComponent> = {
  title: 'Components/Paginator',
  component: PaginatorComponent,
  tags: ['autodocs'],
  render: (args: PaginatorComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [PaginatorComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
    pageSizeChangeEvent: { control: { disable: true } },
  }
};

export default meta;
type Story = StoryObj<PaginatorComponent>;

export const simple: Story = {};

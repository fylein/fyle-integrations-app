import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SelectModule } from 'primeng/select';
import { PaginatorComponent } from 'src/app/shared/components/helper/paginator/paginator.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<PaginatorComponent> = {
  title: 'Core/Paginator',
  component: PaginatorComponent,
  tags: ['autodocs'],
  render: (args: PaginatorComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SelectModule, BrowserAnimationsModule, SharedModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<PaginatorComponent>;

export const simple: Story = {
  args: {
    dropDownValue: 10,
    page: 1,
    totalCount: 100,
  },
};

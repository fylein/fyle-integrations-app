import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SkeletonModule } from 'primeng/skeleton';
import { ShimmersComponent } from 'src/app/shared/components/helper/shimmers/shimmers.component';

const meta: Meta<ShimmersComponent> = {
  title: 'Core/Shimmers',
  component: ShimmersComponent,
  tags: ['autodocs'],
  render: (args: ShimmersComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ShimmersComponent],
      imports: [CommonModule, SkeletonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ShimmersComponent>;

export const exportLog: Story = {
  args: {
    isExportLogFetchInProgress: true,
    exportLogHeader: 'Export Logs',
  },
};

export const dashboard: Story = {
  args: {
    exportLogHeader: 'Dashboard',
    isDashboardImportInProgress: true,
  },
};

export const mapping: Story = {
  args: {
    exportLogHeader: 'Mapping',
    isMappingTableShimmers: true,
  },
};

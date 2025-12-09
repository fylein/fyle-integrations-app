import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { MappingState } from 'src/app/core/models/enum/enum.model';
import { MappingFilterComponent } from 'src/app/shared/components/helper/mapping/mapping-filter/mapping-filter.component';

const meta: Meta<MappingFilterComponent> = {
  title: 'Mapping/MappingFilter',
  component: MappingFilterComponent,
  tags: ['autodocs'],
  render: (args: MappingFilterComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, SelectModule, InputTextModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<MappingFilterComponent>;

export const simple: Story = {
  args: {
    selectedAlphabeticalFilter: 'All',
    mappingFilter: MappingState.ALL,
  },
};

export const alphabetFilter: Story = {
  args: {
    selectedAlphabeticalFilter: 'C',
    mappingFilter: MappingState.MAPPED,
  },
};

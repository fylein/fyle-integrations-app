
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MultiSelectComponent } from 'src/app/shared/components/input/multi-select/multi-select.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QBOImportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';

const meta: Meta<MultiSelectComponent> = {
  title: 'Input/MultiSelect',
  component: MultiSelectComponent,
  tags: ['autodocs'],
  render: (args: MultiSelectComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [MultiSelectComponent],
      imports: [CommonModule, BrowserAnimationsModule, SharedModule, FormsModule, ReactiveFormsModule, MultiSelectModule]
    })
  ],
  argTypes: {
  }
};

export default meta;
type Story = StoryObj<MultiSelectComponent>;

export const simple: Story = {
  args: {
    options: QBOImportSettingModel.getChartOfAccountTypesList(),
    placeholder: 'Select Chart of Accouts',
    form: setupStoryBookFormGroup(new FormGroup({ chartOfAccountTypes: new FormControl(['Expense']) })),
    formControllerName: 'chartOfAccountTypes',
    disabledOption: 'Expense'
  }
};


import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { QBOImportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { ConfigurationMultiSelectComponent } from 'src/app/shared/components/configuration/configuration-multi-select/configuration-multi-select.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<ConfigurationMultiSelectComponent> = {
  title: 'Input/ConfigurationMultiSelect',
  component: ConfigurationMultiSelectComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationMultiSelectComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, BrowserAnimationsModule, SharedModule, FormsModule, ReactiveFormsModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationMultiSelectComponent>;

export const simple: Story = {
  args: {
    label: 'Select the accounts from QuickBooks Online to import as categories',
    options: QBOImportSettingModel.getChartOfAccountTypesList(),
    placeholder: 'Select Chart of Accouts',
    form: setupStoryBookFormGroup(new FormGroup({ chartOfAccountTypes: new FormControl(['Expense']) })),
    formControllerName: 'chartOfAccountTypes'
  }
};

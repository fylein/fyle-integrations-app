import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationRadioFieldComponent } from 'src/app/shared/components/configuration/configuration-radio-field/configuration-radio-field.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

const meta: Meta<ConfigurationRadioFieldComponent> = {
  title: 'Configuration/ExportSetting/ConfigurationRadioField',
  component: ConfigurationRadioFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationRadioFieldComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationRadioFieldComponent],
      imports: [CommonModule, RadioButtonModule, FormsModule, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationRadioFieldComponent>;

export const simple: Story = {
  args: {
    form: setupStoryBookFormGroup(new FormGroup({ reimbursableExportType: new FormControl() })),
    isFieldMandatory: true,
    mandatoryErrorListName: 'how expenses to be exported',
    label: 'How should the expenses be exported?',
    subLabel: 'Choose the type of transaction in QuickBooks Desktop to export your expenses.',
    options: [
      {
        label: 'Bill',
        value: 'BILL',
      },
      {
        label: 'Check',
        value: 'CHECK',
      },
      {
        label: 'Expense',
        value: 'EXPENSE',
      },
    ],
    iconPath: 'expense',
    formControllerName: 'reimbursableExportType',
  },
};

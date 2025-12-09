import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationSelectFieldComponent } from 'src/app/shared/components/configuration/configuration-select-field/configuration-select-field.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<ConfigurationSelectFieldComponent> = {
  title: 'Configuration/ConfigurationSelectField',
  component: ConfigurationSelectFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationSelectFieldComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SharedModule, BrowserAnimationsModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationSelectFieldComponent>;

export const simple: Story = {
  args: {
    form: setupStoryBookFormGroup(new FormGroup({ employeeMapping: new FormControl('') })),
    isFieldMandatory: true,
    mandatoryErrorListName: 'option',
    label: 'How are your Employees represented in QuickBooks Online?',
    subLabel:
      'Select how you represent your employees in QuickBooks Online. This would help to export the expenses from ' +
      brandingConfig.brandName +
      ' to the correct employee/vendor record in QuickBooks Online.',
    options: [
      { label: 'Employee', value: 'EMPLOYEE' },
      { label: 'Vendor', value: 'VENDOR' },
    ],
    iconPath: 'employee',
    placeholder: 'Select representation',
    formControllerName: 'employeeMapping',
  },
};

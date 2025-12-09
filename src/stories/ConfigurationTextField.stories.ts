import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationTextFieldComponent } from 'src/app/shared/components/configuration/configuration-text-field/configuration-text-field.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<ConfigurationTextFieldComponent> = {
  title: 'Input/ConfigurationTextField',
  component: ConfigurationTextFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationTextFieldComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationTextFieldComponent>;

export const simple: Story = {
  args: {
    customErrorMessage: 'Invalid User ID. Please enter valid User ID',
    formControllerName: 'userID',
    isFieldMandatory: true,
    label: 'HH2 User ID',
    placeholder: 'Enter HH2 User ID',
    form: setupStoryBookFormGroup(new FormGroup({ userID: new FormControl('') })),
  },
};

export const password: Story = {
  args: {
    customErrorMessage: 'Invalid Password',
    formControllerName: 'userID',
    isFieldMandatory: true,
    label: 'HH2 Password',
    placeholder: 'Enter HH2 Password',
    form: setupStoryBookFormGroup(new FormGroup({ userID: new FormControl('') })),
    type: 'password',
  },
};

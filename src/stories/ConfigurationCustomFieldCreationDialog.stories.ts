import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationCustomFieldCreationDialogComponent } from 'src/app/shared/components/configuration/configuration-custom-field-creation-dialog/configuration-custom-field-creation-dialog.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<ConfigurationCustomFieldCreationDialogComponent> = {
  title: 'Configuration/ImportSetting/ConfigurationCustomFieldCreationDialog',
  component: ConfigurationCustomFieldCreationDialogComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationCustomFieldCreationDialogComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, DialogModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationCustomFieldCreationDialogComponent>;

export const simple: Story = {
  args: {
    customFieldForm: setupStoryBookFormGroup(
      new FormGroup({
        attribute_type: new FormControl(''),
        display_name: new FormControl(''),
        source_placeholder: new FormControl(''),
      }),
    ),
    showCustomFieldCreationDialog: true,
  },
};

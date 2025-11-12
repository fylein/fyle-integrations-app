
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CloneSettingFieldComponent } from 'src/app/shared/components/onboarding/clone-setting/clone-setting-field/clone-setting-field.component';
import { setupStoryBookFormGroup } from './utility';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputType } from 'src/app/core/models/enum/enum.model';
import { brandingConfig } from 'src/app/branding/branding-config';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { TooltipModule } from 'primeng/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RippleModule } from 'primeng/ripple';
import { SharedModule } from 'src/app/shared/shared.module';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';

const meta: Meta<CloneSettingFieldComponent> = {
  title: 'Onboarding/CloneSetting/CloneSettingField',
  component: CloneSettingFieldComponent,
  tags: ['autodocs'],
  render: (args: CloneSettingFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, BrowserAnimationsModule, SharedModule, RippleModule, ToggleSwitchModule, FormsModule, ReactiveFormsModule, SelectModule, MultiSelectModule, IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' }), TooltipModule]
    })
  ],
  argTypes: {
  }
};

export default meta;
type Story = StoryObj<CloneSettingFieldComponent>;


export const toggle: Story = {
  args: {
    iconSource: 'arrow-tail-down',
    label: 'Import Tax from QuickBooks Online',
    form: setupStoryBookFormGroup(new FormGroup({taxCode: new FormControl(true)})),
    formControllerName: 'taxCode',
    inputType: InputType.TOGGLE,
    tooltipText: 'The imported Tax codes from QuickBooks Online will be set as Tax group in ' + brandingConfig.brandName + '. This will be a selectable field while creating an expense.'
  }
};

export const dropdown: Story = {
  args: {
    iconSource: 'calendar',
    label: 'Set the Credit Card export date as',
    options: [{label: 'Transaction date', value: 'transaction_date'}, {label: 'Expense date', value: 'expense_date'}],
    placeholder: 'Select export date',
    form: setupStoryBookFormGroup(new FormGroup({creditCardExportDate: new FormControl(null)})),
    formControllerName: 'emotion',
    inputType: InputType.DROPDOWN,
    dropdownDisplayKey: 'label',
    tooltipText: 'The selected date will reflect in the corporate card expenses exported to QuickBooks Online.'
  }
};

export const multiSelect: Story = {
  args: {
    label: 'Select the accounts from QuickBooks Online to import as categories',
    options: QboImportSettingsService.getChartOfAccountTypesList(),
    placeholder: 'Select Chart of Accouts',
    form: setupStoryBookFormGroup(new FormGroup({chartOfAccountTypes: new FormControl(['Expense'])})),
    formControllerName: 'chartOfAccountTypes',
    inputType: InputType.MULTI_SELECT,
    dropdownDisplayKey: 'label',
    tooltipText: 'By default expense will be selected. Open the dropdown to select more as per your requirements'
  }
};



import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import type { QBOImportSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { QBOImportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { ConfigurationImportFieldComponent } from 'src/app/shared/components/configuration/configuration-import-field/configuration-import-field.component';
import { setupStoryBookFormGroup } from './utility';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<ConfigurationImportFieldComponent> = {
  title: 'Configuration/ImportSetting/ConfigurationImportField',
  component: ConfigurationImportFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationImportFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, BrowserAnimationsModule, SharedModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationImportFieldComponent>;

const fixture: QBOImportSettingGet = {
  workspace_general_settings: {
    import_categories: true,
    import_items: true,
    import_vendors_as_merchants: true,
    charts_of_accounts: ['Expense'],
    import_tax_codes: true
  },
  general_mappings: {
    default_tax_code: {
      id: '1',
      name: 'Tax Code'
    }
  },
  mapping_settings: [
    {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1,
      source_field: 'PROJECT',
      destination_field: 'CUSTOMER',
      import_to_fyle: true,
      is_custom: true,
      source_placeholder: 'source_placeholder'
    },
    {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1,
      source_field: 'COST_CENTER',
      destination_field: 'CLASS',
      import_to_fyle: false,
      is_custom: true,
      source_placeholder: 'source_placeholder'
    }
  ],
  workspace_id: 1
};
const importSettingForm = QBOImportSettingModel.mapAPIResponseToFormGroup(fixture);

export const fixedDestinationImport: Story = {
  args: {
    form: setupStoryBookFormGroup(importSettingForm),
    appName: AppName.QBO,
    accountingFieldOptions: QBOImportSettingModel.getQBOFields(),
    fyleFieldOptions: [{ attribute_type: 'PROJECT', display_name: 'Project', is_dependent: false }, { attribute_type: 'COST_CENTER', display_name: 'Cost Center', is_dependent: false }, { attribute_type: 'CUSTOM_FIELD', display_name: 'Custom Field', is_dependent: false }],
    isDestinationFixedImport: true
  }
};

export const dynamicDestinationImport: Story = {
  args: {
    form: setupStoryBookFormGroup(importSettingForm),
    appName: AppName.INTACCT,
    accountingFieldOptions: QBOImportSettingModel.getQBOFields(),
    fyleFieldOptions: [{ attribute_type: 'PROJECT', display_name: 'Project', is_dependent: false }, { attribute_type: 'COST_CENTER', display_name: 'Cost Center', is_dependent: false }, { attribute_type: 'CUSTOM_FIELD', display_name: 'Custom Field', is_dependent: false }],
    isDestinationFixedImport: false
  }
};

export const cloneSetting: Story = {
  args: {
    form: setupStoryBookFormGroup(importSettingForm),
    appName: AppName.INTACCT,
    accountingFieldOptions: QBOImportSettingModel.getQBOFields(),
    fyleFieldOptions: [{ attribute_type: 'PROJECT', display_name: 'Project', is_dependent: false }, { attribute_type: 'COST_CENTER', display_name: 'Cost Center', is_dependent: false }, { attribute_type: 'CUSTOM_FIELD', display_name: 'Custom Field', is_dependent: false }],
    isDestinationFixedImport: true,
    isCloneSettingView: true
  }
};

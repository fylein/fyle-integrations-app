
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { QBDExpenseGroupedBy } from 'src/app/core/models/enum/enum.model';
import { MandatoryFieldComponent } from 'src/app/shared/components/helper/mandatory-field/mandatory-field.component';
import { ConfigurationLabelComponent } from 'src/app/shared/components/configuration/configuration-label/configuration-label.component';

const meta: Meta<ConfigurationLabelComponent> = {
  title: 'Configuration/ExportSetting/ConfigurationLabel',
  component: ConfigurationLabelComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationLabelComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationLabelComponent, MandatoryFieldComponent],
      imports: [CommonModule ]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationLabelComponent>;

export const simple: Story = {
  args: {
    label: 'How would you like to group your expenses?',
    subLabel: 'Grouping reflects how the expense entries are posted in QuickBooks Desktop.',
    labelValue: {
      label: 'Expense',
      value: QBDExpenseGroupedBy.EXPENSE
    },
    iconPath: 'tabs'
  }
};

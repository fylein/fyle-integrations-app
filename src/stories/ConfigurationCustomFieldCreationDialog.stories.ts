
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ConfigurationCustomFieldCreationDialogComponent } from 'src/app/shared/components/configuration/configuration-custom-field-creation-dialog/configuration-custom-field-creation-dialog.component';

const meta: Meta<ConfigurationCustomFieldCreationDialogComponent> = {
  title: 'Components/ConfigurationCustomFieldCreationDialog',
  component: ConfigurationCustomFieldCreationDialogComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationCustomFieldCreationDialogComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationCustomFieldCreationDialogComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationCustomFieldCreationDialogComponent>;

export const simple: Story = {};

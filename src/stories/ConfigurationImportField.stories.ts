
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationImportFieldComponent } from 'src/app/shared/components/configuration/configuration-import-field/configuration-import-field.component';

const meta: Meta<ConfigurationImportFieldComponent> = {
  title: 'Components/ConfigurationImportField',
  component: ConfigurationImportFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationImportFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationImportFieldComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationImportFieldComponent>;

export const simple: Story = {};

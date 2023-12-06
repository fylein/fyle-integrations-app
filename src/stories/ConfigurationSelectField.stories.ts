
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ConfigurationSelectFieldComponent } from 'src/app/shared/components/configuration/configuration-select-field/configuration-select-field.component';

const meta: Meta<ConfigurationSelectFieldComponent> = {
  title: 'Components/ConfigurationSelectField',
  component: ConfigurationSelectFieldComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationSelectFieldComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationSelectFieldComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationSelectFieldComponent>;

export const simple: Story = {};

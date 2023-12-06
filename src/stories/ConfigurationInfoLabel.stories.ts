
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ConfigurationInfoLabelComponent } from 'src/app/shared/components/configuration/configuration-info-label/configuration-info-label.component';

const meta: Meta<ConfigurationInfoLabelComponent> = {
  title: 'Components/ConfigurationInfoLabel',
  component: ConfigurationInfoLabelComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationInfoLabelComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationInfoLabelComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationInfoLabelComponent>;

export const simple: Story = {};

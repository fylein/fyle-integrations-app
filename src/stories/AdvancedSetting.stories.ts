
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { AdvancedSettingComponent } from 'src/app/shared/components/qbd/configuration/advanced-setting/advanced-setting.component';

const meta: Meta<AdvancedSettingComponent> = {
  title: 'Components/AdvancedSetting',
  component: AdvancedSettingComponent,
  tags: ['autodocs'],
  render: (args: AdvancedSettingComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [AdvancedSettingComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<AdvancedSettingComponent>;

export const simple: Story = {};

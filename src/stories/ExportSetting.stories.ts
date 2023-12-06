
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ExportSettingComponent } from 'src/app/shared/components/qbd/configuration/export-setting/export-setting.component';

const meta: Meta<ExportSettingComponent> = {
  title: 'Components/ExportSetting',
  component: ExportSettingComponent,
  tags: ['autodocs'],
  render: (args: ExportSettingComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ExportSettingComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ExportSettingComponent>;

export const simple: Story = {};

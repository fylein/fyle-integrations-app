import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CloneSettingHeaderComponent } from 'src/app/shared/components/onboarding/clone-setting/clone-setting-header/clone-setting-header.component';

const meta: Meta<CloneSettingHeaderComponent> = {
  title: 'Onboarding/CloneSetting/CloneSettingHeader',
  component: CloneSettingHeaderComponent,
  tags: ['autodocs'],
  render: (args: CloneSettingHeaderComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [CloneSettingHeaderComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<CloneSettingHeaderComponent>;

export const simple: Story = {
  args: {
    headerText: 'Advanced Settings',
    subHeaderText: 'In this section,  you can configure settings to automate and customize your expense exports',
  },
};

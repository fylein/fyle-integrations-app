import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TooltipModule } from 'primeng/tooltip';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { ConfigurationStepHeaderComponent } from 'src/app/shared/components/configuration/configuration-step-header/configuration-step-header.component';

const meta: Meta<ConfigurationStepHeaderComponent> = {
  title: 'Configuration/ConfigurationStepHeader',
  component: ConfigurationStepHeaderComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationStepHeaderComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationStepHeaderComponent],
      imports: [CommonModule, TooltipModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationStepHeaderComponent>;

export const simple: Story = {
  args: {
    headerText: 'Advanced Settings',
    contentText: 'In this section, you can customize the integration based on your accounting requirements.',
    redirectLink: 'https://www.fylehq.com/help/en/articles/5239189-advanced-settings',
    showSyncButton: true,
    appName: AppName.QBO,
  },
};

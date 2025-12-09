import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { ConfigurationWarningEvent } from 'src/app/core/models/enum/enum.model';
import { ConfigurationConfirmationDialogComponent } from 'src/app/shared/components/configuration/configuration-confirmation-dialog/configuration-confirmation-dialog.component';

const meta: Meta<ConfigurationConfirmationDialogComponent> = {
  title: 'Configuration/Dialog/ConfigurationConfirmationDialog',
  component: ConfigurationConfirmationDialogComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationConfirmationDialogComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationConfirmationDialogComponent],
      imports: [CommonModule, ButtonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationConfirmationDialogComponent>;

export const simple: Story = {
  args: {
    isWarningVisible: true,
    event: ConfigurationWarningEvent.INCORRECT_QBO_ACCOUNT_CONNECTED,
    headerText: 'Your settings are pre-filled',
    contextText: `Your previous organization's settings <b>(Fyle for Ashwin)</b> have been copied over to the current organization
    <br><br>You can change the settings or reset the configuration to restart the process from the beginning<br>`,
    iconPath: 'assets/icons/alert_dialog.svg',
    confirmBtnText: 'Continue',
    showSecondaryCTA: false,
  },
};

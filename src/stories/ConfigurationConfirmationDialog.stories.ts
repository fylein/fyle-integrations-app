
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationConfirmationDialogComponent } from 'src/app/shared/components/configuration/configuration-confirmation-dialog/configuration-confirmation-dialog.component';

const meta: Meta<ConfigurationConfirmationDialogComponent> = {
  title: 'Components/ConfigurationConfirmationDialog',
  component: ConfigurationConfirmationDialogComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationConfirmationDialogComponent) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [ConfigurationConfirmationDialogComponent],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<ConfigurationConfirmationDialogComponent>;

export const simple: Story = {};

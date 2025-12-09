import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfigurationConnectorComponent } from 'src/app/shared/components/configuration/configuration-connector/configuration-connector.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta<ConfigurationConnectorComponent> = {
  title: 'Configuration/Connector/ConfigurationConnector',
  component: ConfigurationConnectorComponent,
  tags: ['autodocs'],
  render: (args: ConfigurationConnectorComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SharedModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ConfigurationConnectorComponent>;

export const simple: Story = {
  args: {
    accountingAppTitle: 'QuickBooks Online Company',
    accountingCompanyName: 'Sandbox 1',
    fyleOrgName: 'Fyle Org 1',
    accountingCompanyTokenExpired: false,
    isAccountingCompanyConnected: true,
    showDisconnect: true,
    accountingCompanyConnectionInProgress: false,
    switchLinkText: 'Disconnect',
  },
};

export const expiredToken: Story = {
  args: {
    accountingAppTitle: 'QuickBooks Online Company',
    accountingCompanyName: 'Sandbox 1',
    fyleOrgName: 'Fyle Org 1',
    accountingCompanyTokenExpired: true,
    isAccountingCompanyConnected: true,
    showDisconnect: false,
    accountingCompanyConnectionInProgress: false,
    switchLinkText: 'Disconnect',
  },
};

export const refreshingDimension: Story = {
  args: {
    accountingAppTitle: 'QuickBooks Online Company',
    accountingCompanyName: 'Sandbox 1',
    fyleOrgName: 'Fyle Org 1',
    accountingCompanyTokenExpired: false,
    isAccountingCompanyConnected: false,
    showDisconnect: false,
    accountingCompanyConnectionInProgress: true,
    switchLinkText: 'Disconnect',
  },
};

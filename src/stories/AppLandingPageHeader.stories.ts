import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { brandingConfig } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { AppLandingPageHeaderComponent } from 'src/app/shared/components/helper/app-landing-page-header/app-landing-page-header.component';

const meta: Meta<AppLandingPageHeaderComponent> = {
  title: 'Onboarding/Landing/AppLandingPageHeader',
  component: AppLandingPageHeaderComponent,
  tags: ['autodocs'],
  render: (args: AppLandingPageHeaderComponent) => ({
    props: { ...args },
  }),
  decorators: [
    moduleMetadata({
      declarations: [AppLandingPageHeaderComponent],
      imports: [CommonModule, ButtonModule],
    }),
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<AppLandingPageHeaderComponent>;

export const qbo: Story = {
  args: {
    appName: AppName.QBO,
    iconPath: 'assets/logos/qbo.png',
    appDescription:
      'Import data from QuickBooks Online to ' +
      brandingConfig.brandName +
      ' and Export expenses from ' +
      brandingConfig.brandName +
      ' to QuickBooks Online. ',
    isLoading: false,
    isIntegrationSetupInProgress: false,
    isIntegrationConnected: false,
    redirectLink: 'qbo/onboarding/connector',
    buttonText: 'Connect',
    postConnectionRoute: 'qbo/onboarding/connector',
    showQBOButton: true,
  },
};

export const QBD: Story = {
  args: {
    appName: AppName.QBD,
    iconPath: 'assets/logos/quickbooks-desktop.svg',
    appDescription:
      'Import data from QBD to ' +
      brandingConfig.brandName +
      ' and Export expenses from ' +
      brandingConfig.brandName +
      ' to QBD. ',
    isLoading: false,
    isIntegrationSetupInProgress: false,
    isIntegrationConnected: false,
    redirectLink: 'qbd/onboarding/connector',
    buttonText: 'Connect',
    postConnectionRoute: 'qbd/onboarding/connector',
  },
};

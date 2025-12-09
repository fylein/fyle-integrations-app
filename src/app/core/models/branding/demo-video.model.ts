import { Sage50ImportableField } from '../sage50/sage50-configuration/sage50-import-settings.model';

export type DemoVideo = {
  [brandingId: string]: {
    onboarding: {
      QBD_DIRECT: string;
      INTACCT: string;
      SAGE300: string;
      QBO: string;
      BUSINESS_CENTRAL: string;
      TRAVELPERK: string;
      XERO: string;
      NETSUITE: string;
      SAGE50: string;
    };
    postOnboarding: {
      SAGE50: Record<Sage50ImportableField, string>;
    };
  };
};

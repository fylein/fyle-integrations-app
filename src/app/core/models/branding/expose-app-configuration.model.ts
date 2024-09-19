export interface AllowedAppsConfiguration {
    [brandingId: string]: {
        [envId: string]: {
            INTACCT: boolean;
            SAGE300: boolean;
            QBO: boolean;
            BUSINESS_CENTRAL: boolean;
            TRAVELPERK: boolean;
            XERO: boolean;
            NETSUITE: boolean;
            QBD: boolean;
            BAMBOO: boolean;
        }
    }
}
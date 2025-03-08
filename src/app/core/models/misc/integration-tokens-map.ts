import { IntegrationAppKey } from "../enum/enum.model";

export type Tokens = {
    refresh_token: string;
    access_token: string;
};

export type IntegrationTokensMap = Partial<Record<IntegrationAppKey, Tokens>>
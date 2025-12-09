import { ConfigurationWarningEvent } from '../enum/enum.model';

export type ConfigurationWarningOut = {
  hasAccepted: boolean;
  event: ConfigurationWarningEvent;
};

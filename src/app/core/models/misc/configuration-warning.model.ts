import type { ConfigurationWarningEvent } from "../enum/enum.model";

export interface ConfigurationWarningOut {
    hasAccepted: boolean,
    event: ConfigurationWarningEvent
}

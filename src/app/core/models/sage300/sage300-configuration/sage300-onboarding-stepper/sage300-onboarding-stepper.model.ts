import { Sage300OnboardingState } from "../../../enum/enum.model";

export type Sage300OnboardingStepperMap = {
    [Sage300OnboardingState.CONNECTION]: number,
    [Sage300OnboardingState.CONNECTOR_AUTH]: number,
    [Sage300OnboardingState.EXPORT_SETTINGS]: number,
    [Sage300OnboardingState.IMPORT_SETTINGS]: number,
    [Sage300OnboardingState.ADVANCED_SETTINGS]: number,
    [Sage300OnboardingState.COMPLETE]: number,
}
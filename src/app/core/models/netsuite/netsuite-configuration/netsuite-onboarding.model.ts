import { NetsuiteOnboardingState } from "../../enum/enum.model";


export type NetsuiteOnboardingStepperMap = {
    [NetsuiteOnboardingState.CONNECTION]: number,
    [NetsuiteOnboardingState.SUBSIDIARY]: number,
    [NetsuiteOnboardingState.EXPORT_SETTINGS]: number,
    [NetsuiteOnboardingState.IMPORT_SETTINGS]: number,
    [NetsuiteOnboardingState.ADVANCED_CONFIGURATION]: number,
    [NetsuiteOnboardingState.COMPLETE]: number,
}

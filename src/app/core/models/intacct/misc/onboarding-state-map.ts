import { IntacctOnboardingState } from "../../enum/enum.model";

export const onboardingStateComponentMap = {
    [IntacctOnboardingState.CONNECTION]: '/integrations/intacct/onboarding/landing',
    [IntacctOnboardingState.LOCATION_ENTITY]: '/integrations/intacct/onboarding/connector',
    [IntacctOnboardingState.EXPORT_SETTINGS]: '/integrations/intacct/onboarding/export_settings',
    [IntacctOnboardingState.IMPORT_SETTINGS]: '/integrations/intacct/onboarding/import_settings',
    [IntacctOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/intacct/onboarding/advanced_settings',
    [IntacctOnboardingState.COMPLETE]: '/integrations/intacct/main/dashboard'
};

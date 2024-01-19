export type FeatureConfiguration = {
    [brandingId: string]: {
        reimbursableExpenses: boolean;
        illustrationsAllowed: boolean;
        isGradientAllowed: boolean;
    }
}
import { FormControl, FormGroup } from "@angular/forms";

export enum Sage50ImportableCOATypes {
    INCOME = "Income",
    EXPENSES = "Expenses",
    INVENTORY = "Inventory",
    OTHER_ASSETS = "Other Assets",
    FIXED_ASSETS = "Fixed Assets",
    COST_OF_SALES = "Cost of Sales",
    OTHER_CURRENT_ASSETS = "Other Current Assets"
}

export type Sage50ImportSettingsPost = {
    import_account_as_category: true,
    chart_of_accounts: Sage50ImportableCOATypes[],
    import_vendor_as_merchant: boolean,
    import_code_fields: ["ACCOUNT", "JOB"]
}

// TODO: properly type all form groups
export type Sage50ImportSettingsForm = {
    account: FormGroup,
    vendor: FormGroup,
    job: FormGroup,
    phase: FormGroup,
    costCode: FormGroup,
}
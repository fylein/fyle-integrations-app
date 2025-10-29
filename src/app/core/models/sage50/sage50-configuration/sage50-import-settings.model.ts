import { FormControl, FormGroup } from "@angular/forms";
import { CSVImportFieldForm } from "../../misc/configuration-csv-import-field.model";

export enum Sage50ImportableCOAType {
    EXPENSES = "Expenses",
    COST_OF_SALES = "Cost of Sales",
    INVENTORY = "Inventory",
    OTHER_CURRENT_ASSETS = "Other Current Assets",
    FIXED_ASSETS = "Fixed Assets",
    OTHER_ASSETS = "Other Assets",
    INCOME = "Income"
}

export enum Sage50ImportableField {
    JOB = 'JOB',
    PHASE = 'PHASE',
    VENDOR = 'VENDOR',
    ACCOUNT = 'ACCOUNT',
    COST_CODE = 'COST_CODE',
}

export enum Sage50FyleField {
    CATEGORY = 'CATEGORY',
    MERCHANT = 'MERCHANT',
    PROJECT = 'PROJECT',
    COST_CODE = 'COST_CODE',
    COST_CENTER = 'COST_CENTER',
    LOCATION = 'LOCATION'
}

export type Sage50MappingSettingRow = {
    source_field: Sage50FyleField,
    destination_field: Sage50ImportableField,
    import_to_fyle: boolean,
    is_custom: boolean,
    source_placeholder: string | null
}

export type Sage50ImportSettingsGet = {
    import_settings: {
        import_account_as_category: true,
        chart_of_accounts: Sage50ImportableCOAType[],
        import_vendor_as_merchant: boolean,
        import_code_fields: Sage50ImportableField[]
    },
    mapping_settings: Sage50MappingSettingRow[] | [],
}

export type Sage50ImportSettingsPost = Sage50ImportSettingsGet;

export type Sage50ImportableCOAGet = {
    chart_of_account: Sage50ImportableCOAType,
    count: number
}[];

export interface Sage50AccountsCSVImportFieldForm extends CSVImportFieldForm {
    accountTypes: FormControl<Sage50ImportableCOAType[] | null>;
}

export interface Sage50CSVImportFieldFormWithMapping extends CSVImportFieldForm {
    sourceField: FormControl<Sage50FyleField | null>;
    destinationField: FormControl<Sage50ImportableField>;
    sourcePlaceholder: FormControl<string | null>;
}

export type Sage50ImportSettingsForm = {
    ACCOUNT: FormGroup<Sage50AccountsCSVImportFieldForm>,
    VENDOR: FormGroup<CSVImportFieldForm>,
    JOB: FormGroup<Sage50CSVImportFieldFormWithMapping>,
    PHASE: FormGroup<Sage50CSVImportFieldFormWithMapping>,
    COST_CODE: FormGroup<Sage50CSVImportFieldFormWithMapping>
}

import { FormControl } from "@angular/forms";

export type UploadedCSVFile = {
    name: string | null;
    valueCount: number | null;
    lastUploadedAt: Date | null;
};

export type CSVImportFieldForm = {
    enabled: FormControl<boolean>;
    file: FormControl<UploadedCSVFile | null>;
    importCode: FormControl<boolean | null>;
};

export interface CSVImportFieldFormWithMapping extends CSVImportFieldForm {
    sourceField: FormControl<string | null>;
    destinationField: FormControl<string>;
    sourcePlaceholder: FormControl<string | null>;
}
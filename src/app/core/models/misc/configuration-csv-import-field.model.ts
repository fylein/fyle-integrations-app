import { FormControl } from "@angular/forms";

export type UploadedCSVFile = {
    name: string;
    valueCount: number;
    lastUploadedAt: Date;
};

export type CSVImportFieldForm = {
    enabled: FormControl<boolean>;
    file: FormControl<UploadedCSVFile | null>;
    importCode: FormControl<boolean | null>;
};
import { Sage50CCCExportType, Sage50ReimbursableExportType } from "../sage50/sage50-configuration/sage50-export-settings.model";
import { Expense } from "./expense.model";

export type CsvExportLogItem = {
    expenses: Expense[];
    type:
        | Sage50CCCExportType
        | Sage50ReimbursableExportType;
    exported_at?: string;
    error_count?: number;
    file_name?: string;
    file_id?: string;
};

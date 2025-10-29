import { Expense } from "./expense.model";

export type CsvExportLogItem = {
    expenses: Expense[];
    type: string;
    exported_at?: string;
    error_count?: number;
    file_name?: string;
    file_id?: string;
};

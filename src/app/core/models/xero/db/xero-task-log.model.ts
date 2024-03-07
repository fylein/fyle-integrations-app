import { PaginatedResponse } from "../../db/paginated-response.model";
import { TaskLog } from "../../db/task-log.model";
import { XeroTaskLogType } from "../../enum/enum.model";

export type XeroError = {
    expense_group_id: number;
    short_description: string;
    long_description: string;
    type: string;
};

export interface XeroTaskLogs extends TaskLog {
    bill: number;
    cheque: number;
    credit_card_purchase: number;
    xero_errors: XeroError[];
    journal_entry: number;
    bill_payment: number;
    task_id: string;
    type: XeroTaskLogType;
}

export interface XeroTaskResponse extends PaginatedResponse {
    results: Task[];
}
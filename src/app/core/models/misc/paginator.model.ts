import { AccountingExportStatus } from "../enum/enum.model";

export type Paginator = {
    limit: number,
    offset: number
};

export interface Params extends Paginator {
    state?: AccountingExportStatus,
    start_date?: string,
    end_date?: string,
    exported_at?: Date
}
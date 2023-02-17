import { QbdAccountingExportsGet, QbdAccountingExportsPost, QbdExportTriggerGet } from "src/app/core/models/qbd/db/iif-logs.model";

export const getQbdAccountingExports: QbdAccountingExportsGet = {
    count: 4,
    next: null,
    previous: null,
    results: [
        {
            id: 2,
            type: "EXPORT_BILLS",
            file_id: "fieZ6GMSmgkb",
            task_id: null,
            status: "COMPLETE",
            errors: null,
            created_at: new Date("2023-02-09"),
            updated_at: new Date("2023-02-09"),
            workspace: 1
        },
        {
            id: 1,
            type: "FETCHING_REIMBURSABLE_EXPENSES",
            file_id: null,
            task_id: null,
            status: "IN_PROGRESS",
            errors: null,
            created_at: new Date("2023-02-09T12:39:31.005110Z"),
            updated_at: new Date("2023-02-09T12:39:31.005110Z"),
            workspace: 1
        }

    ]
};

export const postQbdAccountingExports: QbdAccountingExportsPost = {
    accounting_export_id: 2,
    download_url: "fyle",
    file_id: "fieZ6GMSmgkb",
    workspace_id: 1
};

export const postQbdTriggerExportResponse: QbdExportTriggerGet = {
    message: "Trigger successful"
};

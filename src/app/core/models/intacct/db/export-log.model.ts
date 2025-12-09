export type IntacctExports = {
  id: number;
  type: string;
  fund_source: string;
  file_id: string | null;
  task_id: number | null;
  status: string;
  errors: string[] | null;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  download?: string;
};

export type IntacctExportTriggerResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: IntacctExports[];
};

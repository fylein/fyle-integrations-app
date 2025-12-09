export const mockDataFailed = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 8290,
      type: 'PURCHASE_INVOICE',
      status: 'FAILED',
      mapping_errors: [
        {
          type: 'Employee Mapping',
          value: 'nilesh.p@fyle.in',
        },
        {
          type: 'Category Mapping',
          value: 'Unspecified',
        },
      ],
      sage_300_errors: {
        created_on: '2023-08-17T09:46:30Z',
        entity_id: '728406bd-32f6-4676-95ff-b06100a0f840',
        error_msg:
          "Exception of type 'DBI.Synchronization.Processing.TimberlineOffice.KeyAlreadyInUseException' was thrown.",
        id: '6615abdf-733f-4190-a4ed-b06100a1166f',
        type_id: '4de325f1-a380-41cc-90ce-be1e02fef167',
        version: 12967,
      },
      response: {},
      created_at: '2023-10-09T09:48:30.764031Z',
      updated_at: '2023-10-09T09:48:38.929923Z',
      exported_at: '2023-10-09T09:48:38.929923Z',
      workspace: 313,
      purchase_invoice_id: null,
      export_url: 'odsifodkmf.com',
      direct_costs_id: null,
      sage_300_reimbursement: null,
    },
  ],
};

export const mockDataComplete = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: 8291,
      type: 'DIRECT_COSTS',
      status: 'COMPLETE',
      mapping_errors: [],
      sage_300_errors: null,
      created_at: '2023-10-09T09:48:30.802135Z',
      updated_at: '2023-10-09T09:48:35.369142Z',
      exported_at: '2023-10-09T09:48:38.929923Z',
      workspace: 313,
      response: {},
      purchase_invoice_id: 12,
      export_url: 'odsifodkmf.com',
      direct_costs_id: null,
      sage_300_reimbursement: null,
    },
  ],
};

import { Injectable } from "@angular/core";
import { ApiService } from "../../common/api.service";
import { ExportSettingsService } from "../../common/export-settings.service";
import { Observable } from "rxjs";
import { WorkspaceService } from "../../common/workspace.service";
import { Sage50CCCExportType, Sage50ExpensesGroupedBy, Sage50ExportSettingsPost, Sage50ExportSettingsForm, Sage50ReimbursableExpenseDate, Sage50ReimbursableExportType, Sage50ExportSettingsGet } from "src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model";
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { SelectFormOption } from "src/app/core/models/common/select-form-option.model";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";


export const FIELD_DEPENDENCIES = new Map<keyof Sage50ExportSettingsForm, (form: AbstractControl) => boolean>([
  ['reimbursableExpenses', () => true], // No dependencies, always show
  ['reimbursableExportType', (form) => !!form.get('reimbursableExpenses')?.value],
  ['reimbursableDefaultCreditLineAccount', (form) =>
    form.get('reimbursableExportType')?.value === Sage50ReimbursableExportType.GENERAL_JOURNAL_ENTRY
  ],
  ['reimbursableDefaultAccountPayableAccount', (form) =>
    form.get('reimbursableExportType')?.value === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY
  ],
  ['reimbursableExpenseState', (form) =>
    !!form.get('reimbursableExportType')?.value
  ],
  ['reimbursableExportGroup', (form) =>
    !!form.get('reimbursableExportType')?.value
  ],
  ['reimbursableExportDate', (form) =>
    !!form.get('reimbursableExportType')?.value &&
    !!form.get('reimbursableExportGroup')?.value
  ],
  ['cccExpenses', () => true], // No dependencies, always show
  ['cccExportType', (form) => !!form.get('cccExpenses')?.value],
  ['cccDefaultCreditLineAccount', (form) =>
    form.get('cccExportType')?.value === Sage50CCCExportType.GENERAL_JOURNAL_ENTRY
  ],
  ['cccDefaultAccountPayableAccount', (form) =>
    form.get('cccExportType')?.value === Sage50CCCExportType.PURCHASES_RECEIVE_INVENTORY
  ],
  ['defaultCashAccount', (form) =>
    form.get('cccExportType')?.value === Sage50CCCExportType.PAYMENTS_JOURNAL
  ],
  ['defaultVendor', (form) =>
    [Sage50CCCExportType.PURCHASES_RECEIVE_INVENTORY, Sage50CCCExportType.PAYMENTS_JOURNAL]
    .includes(form.get('cccExportType')?.value)
  ],
  ['defaultPaymentMethod', (form) =>
    form.get('cccExportType')?.value === Sage50CCCExportType.PAYMENTS_JOURNAL
  ],
  ['cccExpenseState', (form) => !!form.get('cccExportType')?.value],
  ['cccExportGroup', (form) => !!form.get('cccExportType')?.value],
  ['cccExportDate', (form) =>
    !!form.get('cccExportType')?.value &&
    !!form.get('cccExportGroup')?.value
  ]
]);

@Injectable({
    providedIn: 'root'
  })
export class Sage50ExportSettingsService extends ExportSettingsService {

  // Export type options
  public readonly sage50ReimbursableExportTypeOptions: SelectFormOption[] = [
    {
      label: this.translocoService.translate('services.sage50ExportSettings.generalJournalEntryOptionLabel'),
      value: Sage50ReimbursableExportType.GENERAL_JOURNAL_ENTRY
    },
    {
      label: this.translocoService.translate('services.sage50ExportSettings.purchasesOptionLabel'),
      value: Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY
    }
  ];

  public readonly sage50CCCExportTypeOptions: SelectFormOption[] = [
    {
      label: this.translocoService.translate('services.sage50ExportSettings.generalJournalEntryOptionLabel'),
      value: Sage50CCCExportType.GENERAL_JOURNAL_ENTRY
    },
    {
      label: this.translocoService.translate('services.sage50ExportSettings.purchasesOptionLabel'),
      value: Sage50CCCExportType.PURCHASES_RECEIVE_INVENTORY
    },
    {
      label: this.translocoService.translate('services.sage50ExportSettings.paymentsJournalOptionLabel'),
      value: Sage50CCCExportType.PAYMENTS_JOURNAL
    }
  ];

  // Expense state options
  public readonly sage50ReimbursableExpenseStateOptions = this.getReimbursableExpenseStateOptions();

  public readonly sage50CCCExpenseStateOptions = this.getCCCExpenseStateOptions();

  // Expense grouping options - for both reimbursable and CCC expenses (`value` is specific to sage 50)
  public readonly sage50ExpenseGroupingOptions = [
    {
      label: this.translocoService.translate('services.sage50ExportSettings.expenseOptionLabel'),
      value: Sage50ExpensesGroupedBy.EXPENSE
    },
    {
      label: this.translocoService.translate('services.sage50ExportSettings.reportOptionLabel'),
      value: Sage50ExpensesGroupedBy.REPORT
    }
  ];

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) {
    super();
  }

  getExportSettings(): Observable<Sage50ExportSettingsGet> {
    return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/export_settings/`, {});
  }

  constructPayloadAndPost(form: FormGroup<Sage50ExportSettingsForm>): Observable<void> {
    return this.apiService.post(`/${this.workspaceService.getWorkspaceId()}/settings/export_settings/`, {
      reimbursable_expense_export_type: form.get('reimbursableExportType')?.value,
      reimbursable_expense_state: form.get('reimbursableExpenseState')?.value,
      reimbursable_expense_date: form.get('reimbursableExportDate')?.value,
      reimbursable_expense_grouped_by: form.get('reimbursableExportGroup')?.value,
      reimbursable_default_credit_line_account: form.get('reimbursableDefaultCreditLineAccount')?.value?.id,
      reimbursable_default_account_payable_account: form.get('reimbursableDefaultAccountPayableAccount')?.value?.id,
      credit_card_expense_export_type: form.get('cccExportType')?.value,
      credit_card_expense_state: form.get('cccExpenseState')?.value,
      credit_card_expense_date: form.get('cccExportDate')?.value,
      credit_card_expense_grouped_by: form.get('cccExportGroup')?.value,
      ccc_default_credit_line_account: form.get('cccDefaultCreditLineAccount')?.value?.id,
      ccc_default_account_payable_account: form.get('cccDefaultAccountPayableAccount')?.value?.id,
      default_cash_account: form.get('defaultCashAccount')?.value?.id,
      default_vendor: form.get('defaultVendor')?.value?.id,
      default_payment_method: form.get('defaultPaymentMethod')?.value
    } satisfies Partial<Sage50ExportSettingsPost>);
  }

  findObjectById(array: DestinationAttribute[], id?: number | null): DestinationAttribute | null {
    return array?.find(item => item.id === id) || null;
  }

  mapApiResponseToFormGroup(apiResponse: Sage50ExportSettingsGet | null, accounts: DestinationAttribute[], vendors: DestinationAttribute[]): FormGroup<Sage50ExportSettingsForm> {
    return new FormGroup<Sage50ExportSettingsForm>({
      reimbursableExpenses: new FormControl(apiResponse ? !!apiResponse.reimbursable_expense_export_type : true, { nonNullable: true }),
      reimbursableExportType: new FormControl(apiResponse?.reimbursable_expense_export_type ?? null),
      reimbursableExpenseState: new FormControl(apiResponse?.reimbursable_expense_state ?? null),
      reimbursableExportDate: new FormControl(apiResponse?.reimbursable_expense_date ?? null),
      reimbursableExportGroup: new FormControl(apiResponse?.reimbursable_expense_grouped_by ?? null),
      cccExpenses: new FormControl(apiResponse ? !!apiResponse.credit_card_expense_export_type : true, { nonNullable: true }),
      cccExportType: new FormControl(apiResponse?.credit_card_expense_export_type ?? null),
      cccExpenseState: new FormControl(apiResponse?.credit_card_expense_state ?? null),
      cccExportDate: new FormControl(apiResponse?.credit_card_expense_date ?? null),
      cccExportGroup: new FormControl(apiResponse?.credit_card_expense_grouped_by ?? null),
      reimbursableDefaultAccountPayableAccount: new FormControl(apiResponse?.reimbursable_default_account_payable_account ?? null),
      reimbursableDefaultCreditLineAccount: new FormControl(apiResponse?.reimbursable_default_credit_line_account ?? null),
      cccDefaultCreditLineAccount: new FormControl(apiResponse?.ccc_default_credit_line_account ?? null),
      cccDefaultAccountPayableAccount: new FormControl(apiResponse?.ccc_default_account_payable_account ?? null),
      defaultPaymentMethod: new FormControl(apiResponse?.default_payment_method ?? null),
      defaultVendor: new FormControl(apiResponse?.default_vendor ?? null),
      defaultCashAccount: new FormControl(apiResponse?.default_cash_account ?? null)
    }, {
      validators: (form) => {
        const errors: ValidationErrors = {};

        // If at least one export type is selected (and shown), the other one is optional.
        if (!form.get('reimbursableExportType')?.value && !form.get('cccExportType')?.value) {
          errors.atLeastOneExportType = {
            required: true
          };
        }

        // Validate all fields except toggles and export types. Those are validated above.
        const otherFields = Object.keys(form.value).filter(
          key => !['reimbursableExpenses', 'cccExpenses', 'reimbursableExportType', 'cccExportType'].includes(key)
        ) as (keyof Sage50ExportSettingsForm)[];
        for (const key of otherFields) {
          // If the current field's dependencies are met, it is required
          // If a field is required and empty, add an error
          const condition = FIELD_DEPENDENCIES.get(key as keyof Sage50ExportSettingsForm);
          if (condition && condition(form) && !form.get(key)?.value) {
            errors[key] = {
              required: true
            };
          }
        }
        return Object.keys(errors).length > 0 ? errors : null;
      }
    });
  }
}

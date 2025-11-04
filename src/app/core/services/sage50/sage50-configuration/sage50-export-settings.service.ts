import { Injectable } from "@angular/core";
import { ApiService } from "../../common/api.service";
import { ExportSettingsService } from "../../common/export-settings.service";
import { catchError, Observable, of } from "rxjs";
import { WorkspaceService } from "../../common/workspace.service";
import { Sage50CCCExportType, Sage50ExpensesGroupedBy, Sage50ExportSettingsPost, Sage50ExportSettingsForm, Sage50ReimbursableExpenseDate, Sage50ReimbursableExportType, Sage50ExportSettingsGet } from "src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model";
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { SelectFormOption } from "src/app/core/models/common/select-form-option.model";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";

type DependencyChecker = (
  form: AbstractControl,
  showToggles?: boolean
) => boolean;

export const FIELD_DEPENDENCIES = new Map<keyof Sage50ExportSettingsForm, DependencyChecker>([
  ['reimbursableExpenses', (_, showToggles) => !!showToggles], // Show toggles as necessary
  ['reimbursableExportType', (form) => !!form.get('reimbursableExpenses')?.value],
  ['reimbursableDefaultCreditLineAccount', (form) =>
    form.get('reimbursableExportType')?.value === Sage50ReimbursableExportType.GENERAL_JOURNAL_ENTRY
  ],
  ['reimbursableDefaultAccountPayableAccount', (form) =>
    form.get('reimbursableExportType')?.value === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY
  ],
  ['defaultPerDiemAccount', (form) =>
    !!form.get('reimbursableExportType')?.value
  ],
  ['defaultMileageAccount', (form) =>
    !!form.get('reimbursableExportType')?.value
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
  ['cccExpenses', (_, showToggles) => !!showToggles], // Show toggles as necessary
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
    .includes(form.get('cccExportType')?.value!)
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

  getExportSettings(): Observable<Sage50ExportSettingsGet | null> {
    return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/export_settings/`, {}).pipe(
      catchError(() => of(null))
    );
  }

  constructPayloadAndPost(
    form: FormGroup<Sage50ExportSettingsForm>,
    exportSettingsResponse: Sage50ExportSettingsGet | null,
    isReimbursableEnabled: boolean,
    isCCCEnabled: boolean
  ): Observable<void> {
    const reimbursableExportType =
      isReimbursableEnabled ?
        form.get('reimbursableExportType')?.value :
        exportSettingsResponse?.reimbursable_expense_export_type ?? null;

    const cccExportType =
      isCCCEnabled ?
        form.get('cccExportType')?.value :
        exportSettingsResponse?.credit_card_expense_export_type ?? null;

    return this.apiService.post(`/${this.workspaceService.getWorkspaceId()}/settings/export_settings/`, {
      reimbursable_expense_export_type: reimbursableExportType,
      reimbursable_expense_state: form.get('reimbursableExpenseState')?.value,
      reimbursable_expense_date: form.get('reimbursableExportDate')?.value,
      reimbursable_expense_grouped_by: form.get('reimbursableExportGroup')?.value,
      reimbursable_default_credit_line_account: form.get('reimbursableDefaultCreditLineAccount')?.value?.id,
      reimbursable_default_account_payable_account: form.get('reimbursableDefaultAccountPayableAccount')?.value?.id,
      default_per_diem_account: form.get('defaultPerDiemAccount')?.value?.id,
      default_mileage_account: form.get('defaultMileageAccount')?.value?.id,
      credit_card_expense_export_type: cccExportType,
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

  getEnabledExportTypes(
    apiResponse: Sage50ExportSettingsGet | null,
    isReimbursableEnabled: boolean,
    isCCCEnabled: boolean
  ): { reimbursableExpenses: boolean, cccExpenses: boolean } {

    // If only one payment mode is enabled, enable that section and disable the other
    // This will hide toggles and show settings for the enabled payment mode only
    if (isReimbursableEnabled && !isCCCEnabled) {
      return { reimbursableExpenses: true, cccExpenses: false };
    }
    if (!isReimbursableEnabled && isCCCEnabled) {
      return { reimbursableExpenses: false, cccExpenses: true };
    }
    // If both/neither payment modes are enabled, set the toggles to the value from the API response
    // If unset, default to true (for onboarding, when apiResponse doesn't exist yet)
    return {
      reimbursableExpenses: apiResponse ? !!apiResponse.reimbursable_expense_export_type : true,
      cccExpenses: apiResponse ? !!apiResponse.credit_card_expense_export_type : true
    };
  }

  mapApiResponseToFormGroup(apiResponse: Sage50ExportSettingsGet | null, isReimbursableEnabled: boolean, isCCCEnabled: boolean): FormGroup<Sage50ExportSettingsForm> {
    const { reimbursableExpenses, cccExpenses } = this.getEnabledExportTypes(apiResponse, isReimbursableEnabled, isCCCEnabled);

    return new FormGroup<Sage50ExportSettingsForm>({
      reimbursableExpenses: new FormControl(reimbursableExpenses, { nonNullable: true }),
      reimbursableExportType: new FormControl(apiResponse?.reimbursable_expense_export_type ?? null),
      reimbursableExpenseState: new FormControl(apiResponse?.reimbursable_expense_state ?? null),
      reimbursableExportDate: new FormControl(apiResponse?.reimbursable_expense_date ?? null),
      reimbursableExportGroup: new FormControl(apiResponse?.reimbursable_expense_grouped_by ?? null),
      cccExpenses: new FormControl(cccExpenses, { nonNullable: true }),
      cccExportType: new FormControl(apiResponse?.credit_card_expense_export_type ?? null),
      cccExpenseState: new FormControl(apiResponse?.credit_card_expense_state ?? null),
      cccExportDate: new FormControl(apiResponse?.credit_card_expense_date ?? null),
      cccExportGroup: new FormControl(apiResponse?.credit_card_expense_grouped_by ?? null),
      reimbursableDefaultAccountPayableAccount: new FormControl(apiResponse?.reimbursable_default_account_payable_account ?? null),
      reimbursableDefaultCreditLineAccount: new FormControl(apiResponse?.reimbursable_default_credit_line_account ?? null),
      defaultPerDiemAccount: new FormControl(apiResponse?.default_per_diem_account ?? null),
      defaultMileageAccount: new FormControl(apiResponse?.default_mileage_account ?? null),
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

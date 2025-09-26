import { AbstractControl } from "@angular/forms";
import { CCCExpenseState, ExpenseState, IntacctCorporateCreditCardExpensesObject, IntacctReimbursableExpensesObject, SplitExpenseGrouping } from "../../models/enum/enum.model";
import { DestinationAttribute } from "../../models/db/destination-attribute.model";
import { DefaultDestinationAttribute } from "../../models/db/destination-attribute.model";
import { ExpenseGroupingFieldOption } from "../../models/enum/enum.model";
import { SelectFormOption } from "../../models/common/select-form-option.model";
import { ExportDateType } from "../../models/enum/enum.model";
import { inject, Injectable } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";

@Injectable({
  providedIn: 'root'
})
export class ExportSettingsService {
  protected translocoService: TranslocoService = inject(TranslocoService);

  getReimbursableExpenseStateOptions: () => SelectFormOption[] = () => [
    {
      label: this.translocoService.translate('services.exportSettings.processingOptionLabel'),
      value: ExpenseState.PAYMENT_PROCESSING
    },
    {
      label: this.translocoService.translate('services.exportSettings.closedOptionLabel'),
      value: ExpenseState.PAID
    }
  ];

  getCCCExpenseStateOptions: () => SelectFormOption[] = () => [
    {
      label: this.translocoService.translate('services.exportSettings.approvedOptionLabel'),
      value: CCCExpenseState.APPROVED
    },
    {
      label: this.translocoService.translate('services.exportSettings.closedOptionLabel'),
      value: CCCExpenseState.PAID
    }
  ];

  // Expense grouping options - for both reimbursable and CCC expenses
  getExpenseGroupingOptions: () => SelectFormOption[] = () => [
    {
      label: this.translocoService.translate('services.exportSettings.expenseOptionLabel'),
      value: ExpenseGroupingFieldOption.EXPENSE
    },
    {
      label: this.translocoService.translate('services.exportSettings.reportOptionLabel'),
      value: ExpenseGroupingFieldOption.REPORT
    }
  ];

  getSplitExpenseGroupingOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.exportSettings.singleLineItem'),
        value: SplitExpenseGrouping.SINGLE_LINE_ITEM
      },
      {
        label: this.translocoService.translate('services.exportSettings.multipleLineItem'),
        value: SplitExpenseGrouping.MULTIPLE_LINE_ITEM
      }
    ];
  }

  getExportGroup(exportGroups: string[] | null | undefined): string {
      if (exportGroups) {
          const exportGroup = exportGroups.find((exportGroup) => {
              return exportGroup === ExpenseGroupingFieldOption.EXPENSE_ID || exportGroup === ExpenseGroupingFieldOption.REPORT_ID || exportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroup === ExpenseGroupingFieldOption.SETTLEMENT_ID;
          });
          return exportGroup && exportGroup !== ExpenseGroupingFieldOption.REPORT_ID ? exportGroup : ExpenseGroupingFieldOption.CLAIM_NUMBER;
      }
      return '';
  }

  formatGeneralMappingPayload(destinationAttribute: DestinationAttribute): DefaultDestinationAttribute {
      return {
          name: destinationAttribute.value,
          id: destinationAttribute.destination_id
      };
  }

  constructCCCOptions(brandId: string) {
      if (brandId === 'fyle') {
          return [
              {
                label: this.translocoService.translate('services.exportSettings.bill'),
                value: IntacctReimbursableExpensesObject.BILL
              },
              {
                label: this.translocoService.translate('services.exportSettings.chargeCardTransaction'),
                value: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
              },
              {
                label: this.translocoService.translate('services.exportSettings.expenseReport'),
                value: IntacctReimbursableExpensesObject.EXPENSE_REPORT
              },
              {
                label: this.translocoService.translate('services.exportSettings.journalEntry'),
                value: IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY
              }
            ];
      }
          return [
              {
                label: this.translocoService.translate('services.exportSettings.chargeCardTransaction'),
                value: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
              },
              {
                label: this.translocoService.translate('services.exportSettings.journalEntry'),
                value: IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY
              },
              {
                label: this.translocoService.translate('services.exportSettings.bill'),
                value: IntacctReimbursableExpensesObject.BILL
              }
            ];

  }

  getExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.exportSettings.exportDate'),
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: this.translocoService.translate('services.exportSettings.verificationDate'),
        value: ExportDateType.VERIFIED_AT
      },
      {
        label: this.translocoService.translate('services.exportSettings.spendDate'),
        value: ExportDateType.SPENT_AT
      },
      {
        label: this.translocoService.translate('services.exportSettings.approvalDate'),
        value: ExportDateType.APPROVED_AT
      },
      {
        label: this.translocoService.translate('services.exportSettings.lastSpendDate'),
        value: ExportDateType.LAST_SPENT_AT
      },
      {
        label: this.translocoService.translate('services.exportSettings.cardTransactionPostDate'),
        value: ExportDateType.POSTED_AT
      }
    ];
  }

  constructExportDateOptions(
    isCoreCCCModule: boolean,
    expenseGrouping: ExpenseGroupingFieldOption,
    exportDateType: ExportDateType,
    { allowPostedAt }: {allowPostedAt?: boolean} = {}
  ): SelectFormOption[] {

    // Determine the excluded date based on expenseGrouping
    const excludedSpendDateOption = [ExpenseGroupingFieldOption.EXPENSE_ID, ExpenseGroupingFieldOption.EXPENSE].includes(expenseGrouping)
      ? ExportDateType.LAST_SPENT_AT
      : ExportDateType.SPENT_AT;

    // Deprecate APPROVED_AT and VERIFIED_AT - if the user has already selected one of them, show only that option
    const excludedApprovedOrVerifiedOption = exportDateType === ExportDateType.APPROVED_AT ? [ExportDateType.VERIFIED_AT] : (exportDateType === ExportDateType.VERIFIED_AT ? [ExportDateType.APPROVED_AT] : [ExportDateType.APPROVED_AT, ExportDateType.VERIFIED_AT]);

    // Determine the excluded date based on export Type
    let excludedPostedAtOption = !isCoreCCCModule ? ExportDateType.POSTED_AT : null;

    // Exceptions for users who have already selected posted_at
    if (allowPostedAt) {
      excludedPostedAtOption = null;
    }

    // Array of unwanted dates
    const dateOptionsToBeExcluded = [excludedSpendDateOption, excludedPostedAtOption].concat(excludedApprovedOrVerifiedOption);

    // Get base date options
    const unfilteredDateOptions = this.getExpenseGroupingDateOptions();

    // Filter out excluded and unwanted dates
    return unfilteredDateOptions.filter(option =>
      option.value !== null && !dateOptionsToBeExcluded.includes(option.value as ExportDateType)
    );
  }

  filterDateOptions(exportDateType: ExportDateType, dateOptions: SelectFormOption[]){
    const dateOptionToRemove = exportDateType;
    const filteredOptions = dateOptions.filter(option => option.value !== dateOptionToRemove);
    return filteredOptions;
  }

  constructGroupingDateOptions(exportGroupType: ExpenseGroupingFieldOption, dateOptions: SelectFormOption[]) {
    if (exportGroupType === ExpenseGroupingFieldOption.EXPENSE_ID) {
      return this.filterDateOptions(ExportDateType.LAST_SPENT_AT, dateOptions);
    } else if (exportGroupType===ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroupType===ExpenseGroupingFieldOption.REPORT_ID) {
      return this.filterDateOptions(ExportDateType.SPENT_AT, dateOptions);
    }
    return dateOptions;
  }

  clearInvalidSelectedOption<T>(control: AbstractControl<T | null> | null, validOptions: T[]) {
    const selectedOption = control?.value;
    if (selectedOption && !validOptions.includes(selectedOption)) {
      control?.setValue(null);
    }
  }

  /**
   * If the current selected option is not in the valid options, clear the field
   */
  clearInvalidDateOption(control: AbstractControl | null, validDateOptions: SelectFormOption[]) {
    const validOptions = validDateOptions.map((option) => option.value);
      return this.clearInvalidSelectedOption(control, validOptions);
  }
}

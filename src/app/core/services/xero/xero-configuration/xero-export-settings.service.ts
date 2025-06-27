import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable, Subject } from 'rxjs';
import { XeroExportSettingGet, XeroExportSettingPost } from 'src/app/core/models/xero/xero-configuration/xero-export-settings.model';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { FormControl, FormGroup } from "@angular/forms";
import { SelectFormOption } from "../../../models/common/select-form-option.model";
import { DefaultDestinationAttribute, DestinationAttribute } from "../../../models/db/destination-attribute.model";
import { AutoMapEmployeeOptions, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, SplitExpenseGrouping, XeroCCCExpenseState, XeroCorporateCreditCardExpensesObject, XeroReimbursableExpensesObject } from "../../../models/enum/enum.model";
import { ExportModuleRule, ExportSettingValidatorRule } from "../../../models/common/export-settings.model";
import { brandingConfig } from "src/app/branding/branding-config";
import { ExportSettingsService } from "src/app/core/services/common/export-settings.service";
import { TranslocoService } from '@jsverse/transloco';


const xeroExportSettingCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class XeroExportSettingsService {

  private translocoService: TranslocoService = inject(TranslocoService);

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  static getReimbursableExportTypes() {
    return [
      {
        label: 'Purchase bill',
        value: XeroReimbursableExpensesObject.PURCHASE_BILL
      }
    ];
  }

  static getCreditCardExportTypes() {
    return [
      {
        label: 'Bank transactions',
        value: XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION
      }
    ];
  }

  static getReimbursableExpenseGroupingOptions(): SelectFormOption[] {
    return [
      {
        label: 'Report',
        value: ExpenseGroupingFieldOption.CLAIM_NUMBER
      }
    ];
  }

  static getCCCExpenseGroupingOptions(): SelectFormOption[] {
    return [
      {
        label: 'Expense',
        value: ExpenseGroupingFieldOption.EXPENSE_ID
      }
    ];
  }

  static getAutoMapEmployeeOptions(): SelectFormOption[] {
    return [
      {
        label: 'None',
        value: null
      },
      {
        label: 'Employee name on ' + brandingConfig.brandName + ' to contact name on Xero',
        value: AutoMapEmployeeOptions.NAME
      },
      {
        label: 'Employee email on ' + brandingConfig.brandName + ' to contact email on Xero',
        value: AutoMapEmployeeOptions.EMAIL
      }
    ];
  }

  getReimbursableExpenseGroupingDateOptions(): SelectFormOption[] {
     return [
      {
        label: this.translocoService.translate('common.currentDate'),
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: 'Verification date',
        value: ExportDateType.VERIFIED_AT
      },
      {
        label: 'Spend date',
        value: ExportDateType.SPENT_AT
      },
      {
        label: 'Approval date',
        value: ExportDateType.APPROVED_AT
      },
      {
        label: 'Last spend date',
        value: ExportDateType.LAST_SPENT_AT
      }
    ];
  }

  static getCCCExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
     {
       label: 'Spend date',
       value: ExportDateType.SPENT_AT
     },
     {
       label: 'Card transaction post date',
       value: ExportDateType.POSTED_AT
     }
   ];
 }

  static getReimbursableExpenseStateOptions(): SelectFormOption[] {
    return [
      {
        label: 'Processing',
        value: ExpenseState.PAYMENT_PROCESSING
      },
      {
        label: 'Closed',
        value: ExpenseState.PAID
      }
    ];
  }

  static getCCCExpenseStateOptions(): SelectFormOption[] {
    return [
      {
        label: 'Approved',
        value: XeroCCCExpenseState.APPROVED
      },
      {
        label: 'Closed',
        value: XeroCCCExpenseState.PAID
      }
    ];
  }

  static getSplitExpenseGroupingOptions() {
    return [
      {
        label: 'Single line item',
        value: SplitExpenseGrouping.SINGLE_LINE_ITEM
      },
      {
        label: 'Multiple line item',
        value: SplitExpenseGrouping.MULTIPLE_LINE_ITEM
      }
    ];
  }

  static getValidators(): [ExportSettingValidatorRule, ExportModuleRule[]] {
    const exportSettingValidatorRule: ExportSettingValidatorRule = {
      reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'expenseState'],
      creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'cccExpenseState', 'splitExpenseGrouping']
    };

    const exportModuleRule: ExportModuleRule[] = [
      {
        formController: 'reimbursableExportType',
        requiredValue: {
        }
      },
      {
        formController: 'creditCardExportType',
        requiredValue: {
          [XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION]: ['bankAccount']
        }
      }
    ];

    return [exportSettingValidatorRule, exportModuleRule];
  }

  static mapAPIResponseToFormGroup(exportSettings: XeroExportSettingGet | null, destinationAttribute: DestinationAttribute[]): FormGroup {
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
    return new FormGroup({
      expenseState: new FormControl(exportSettings?.expense_group_settings?.reimbursable_expense_state),
      reimbursableExpense: new FormControl(exportSettings?.workspace_general_settings?.reimbursable_expenses_object ? true : false),
      reimbursableExportType: new FormControl(exportSettings?.workspace_general_settings?.reimbursable_expenses_object ? exportSettings?.workspace_general_settings?.reimbursable_expenses_object : XeroReimbursableExpensesObject.PURCHASE_BILL),
      reimbursableExportGroup: new FormControl(ExpenseGroupingFieldOption.CLAIM_NUMBER),
      reimbursableExportDate: new FormControl(exportSettings?.expense_group_settings?.reimbursable_export_date_type),
      cccExpenseState: new FormControl(exportSettings?.expense_group_settings?.ccc_expense_state),
      creditCardExpense: new FormControl(exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false),
      creditCardExportType: new FormControl(exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object ? exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object : XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION),
      creditCardExportGroup: new FormControl(ExpenseGroupingFieldOption.EXPENSE_ID),
      creditCardExportDate: new FormControl(exportSettings?.expense_group_settings?.ccc_export_date_type),
      bankAccount: new FormControl(exportSettings?.general_mappings?.bank_account?.id ? findObjectByDestinationId(destinationAttribute, exportSettings.general_mappings.bank_account.id) : null),
      autoMapEmployees: new FormControl(exportSettings?.workspace_general_settings?.auto_map_employees),
      searchOption: new FormControl(''),
      splitExpenseGrouping: new FormControl(exportSettings?.expense_group_settings?.split_expense_grouping)
    });
  }

  static constructPayload(exportSettingsForm: FormGroup, isCloneSettings: boolean = false): XeroExportSettingPost {
    const emptyDestinationAttribute: DefaultDestinationAttribute = {id: null, name: null};

    let bankAccount = {...emptyDestinationAttribute};

    if (exportSettingsForm.get('bankAccount')?.value) {
      if (isCloneSettings) {
        bankAccount = exportSettingsForm.get('bankAccount')?.value;
      } else {
        bankAccount = ExportSettingsService.formatGeneralMappingPayload(exportSettingsForm.get('bankAccount')?.value);
      }
    }

    const exportSettingPayload: XeroExportSettingPost = {
      expense_group_settings: {
        reimbursable_expense_state: exportSettingsForm.get('expenseState')?.value,
        reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : ExportDateType.CURRENT_DATE,
        ccc_expense_state: exportSettingsForm.get('cccExpenseState')?.value,
        ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value ? exportSettingsForm.get('creditCardExportDate')?.value : ExportDateType.SPENT_AT,
        split_expense_grouping: exportSettingsForm.get('splitExpenseGrouping')?.value ? exportSettingsForm.get('splitExpenseGrouping')?.value : SplitExpenseGrouping.MULTIPLE_LINE_ITEM
      },
      workspace_general_settings: {
        reimbursable_expenses_object: exportSettingsForm.get('reimbursableExpense')?.value ? XeroReimbursableExpensesObject.PURCHASE_BILL : null,
        corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExpense')?.value ? XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION : null,
        auto_map_employees: exportSettingsForm.get('autoMapEmployees')?.value
      },
      general_mappings: {
        bank_account: bankAccount
      }
    };

    return exportSettingPayload;
  }

  @Cacheable({
    cacheBusterObserver: xeroExportSettingCache$
  })
  getExportSettings(): Observable<XeroExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroExportSettingCache$
  })
  postExportSettings(exportSettingsPayload: XeroExportSettingPost): Observable<XeroExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable, Subject } from 'rxjs';
import { BusinessCentralExportSettingGet, BusinessCentralExportSettingPost, BusinessCentralExportSettingFormOption } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import { HelperService } from '../../common/helper.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { BusinessCentralExportType, ExpenseGroupedBy, CCCExpenseState, ExportDateType, ExpenseState, FyleField, AutoMapEmployeeOptions, NameInJEField } from 'src/app/core/models/enum/enum.model';
import { Validators } from '@angular/forms';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { TranslocoService } from '@jsverse/transloco';


const businessCentralExportSettingCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralExportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService,
    private translocoService: TranslocoService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: businessCentralExportSettingCache$
  })
  getExportSettings(): Observable<BusinessCentralExportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: businessCentralExportSettingCache$
  })
  postExportSettings(exportSettingsPayload: BusinessCentralExportSettingPost): Observable<BusinessCentralExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  getExpenseGroupByOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.expense'),
        value: ExpenseGroupedBy.EXPENSE
      },
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.expenseReport'),
        value: ExpenseGroupedBy.REPORT
      }
    ];
  }

  getCCCExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.cardTransactionPostDate'),
        value: ExportDateType.POSTED_AT
      },
      {
        label: this.translocoService.translate('common.currentDate'),
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.lastSpentDate'),
        value: ExportDateType.LAST_SPENT_AT
      },
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.spentDate'),
        value: ExportDateType.SPENT_AT
      }
    ];
  }

  getReimbursableExpenseGroupingDateOptions(): BusinessCentralExportSettingFormOption[] {
    return [
      {
        label: this.translocoService.translate('common.currentDate'),
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.spentDate'),
        value: ExportDateType.SPENT_AT
      },
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.lastSpentDate'),
        value: ExportDateType.LAST_SPENT_AT
      }
    ];
  }

  getReimbursableExpensesExportTypeOptions(): BusinessCentralExportSettingFormOption[] {
      return [
        {
          label: this.translocoService.translate('services.businessCentralExportSettings.purchaseInvoice'),
          value: BusinessCentralExportType.PURCHASE_INVOICE
        },
        {
          label: this.translocoService.translate('services.businessCentralExportSettings.journalEntry'),
          value: BusinessCentralExportType.JOURNAL_ENTRY
        }
      ];
  }

  getCCCExpensesExportTypeOptions(): BusinessCentralExportSettingFormOption[] {
      return [
        {
          label: this.translocoService.translate('services.businessCentralExportSettings.journalEntry'),
          value: BusinessCentralExportType.JOURNAL_ENTRY
        }
      ];
  }

  getCCCExpenseState(): BusinessCentralExportSettingFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.approved'),
        value: CCCExpenseState.APPROVED
      },
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.closed'),
        value: CCCExpenseState.PAID
      }
    ];
  }

  getReimbursableExpenseState(): BusinessCentralExportSettingFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.processing'),
        value: ExpenseState.PAYMENT_PROCESSING
      },
      {
        label: this.translocoService.translate('services.businessCentralExportSettings.closed'),
        value: ExpenseState.PAID
      }
    ];
  }

  getEntityOptions(): BusinessCentralExportSettingFormOption[] {
      return [
          {
            label: this.translocoService.translate('services.businessCentralExportSettings.employee'),
            value: FyleField.EMPLOYEE
          },
          {
            label: this.translocoService.translate('services.businessCentralExportSettings.vendor'),
            value: FyleField.VENDOR
          }
      ];
  }

  getNameInJEOptions(): BusinessCentralExportSettingFormOption[] {
    return [
        {
          label: this.translocoService.translate('services.businessCentralExportSettings.employee'),
          value: FyleField.EMPLOYEE
        },
        {
          label: this.translocoService.translate('services.businessCentralExportSettings.merchant'),
          value: NameInJEField.MERCHANT
        }
    ];
  }

  getEmployeeMappingOptions(): BusinessCentralExportSettingFormOption[] {
      return [
          { label: this.translocoService.translate('services.businessCentralExportSettings.basedOnEmployeeEmailID'), value: AutoMapEmployeeOptions.EMAIL },
          { label: this.translocoService.translate('services.businessCentralExportSettings.basedOnEmployeeName'), value: AutoMapEmployeeOptions.NAME }
      ];
  }

  static mapAPIResponseToFormGroup(exportSettings: BusinessCentralExportSettingGet | null,  accounts: DestinationAttribute[], vendors: DestinationAttribute[]): FormGroup {
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
      return new FormGroup({
          reimbursableExpense: new FormControl(exportSettings?.reimbursable_expenses_export_type ? true : false),
          reimbursableExportType: new FormControl(exportSettings?.reimbursable_expenses_export_type ? exportSettings.reimbursable_expenses_export_type : null),
          reimbursableExpenseState: new FormControl(exportSettings?.reimbursable_expense_state ? exportSettings?.reimbursable_expense_state : null),
          reimbursableExportDate: new FormControl(exportSettings?.reimbursable_expense_date ? exportSettings?.reimbursable_expense_date.toLowerCase() : null),
          reimbursableExportGroup: new FormControl(exportSettings?.reimbursable_expense_grouped_by ? exportSettings?.reimbursable_expense_grouped_by: null),
          creditCardExpense: new FormControl(exportSettings?.credit_card_expense_export_type ? true : false),
          cccExportType: new FormControl(exportSettings?.credit_card_expense_export_type ? exportSettings.credit_card_expense_export_type : null),
          cccExpenseState: new FormControl(exportSettings?.credit_card_expense_state ? exportSettings?.credit_card_expense_state : null),
          cccExportDate: new FormControl(exportSettings?.credit_card_expense_date ? exportSettings?.credit_card_expense_date.toLowerCase() : null),
          cccExportGroup: new FormControl(exportSettings?.credit_card_expense_grouped_by ? exportSettings?.credit_card_expense_grouped_by: null),
          defaultBankName: new FormControl(exportSettings?.default_bank_account_name ? findObjectByDestinationId(accounts, exportSettings?.default_bank_account_id) : null),
          cccDefaultBankName: new FormControl(exportSettings?.default_ccc_bank_account_name ? findObjectByDestinationId(accounts, exportSettings?.default_ccc_bank_account_id) : null),
          reimbursableEmployeeMapping: new FormControl(exportSettings?.employee_field_mapping ? exportSettings?.employee_field_mapping : null, Validators.required),
          journalEntryNamePreference: new FormControl(exportSettings?.name_in_journal_entry ? exportSettings?.name_in_journal_entry : null),
          autoMapEmployee: new FormControl(exportSettings?.auto_map_employees ? exportSettings?.auto_map_employees : null),
          defaultVendorName: new FormControl(exportSettings?.default_vendor_name ? findObjectByDestinationId(vendors, exportSettings?.default_vendor_id) : null),
          searchOption: new FormControl('')
      });
  }

  static createExportSettingPayload(exportSettingsForm: FormGroup): BusinessCentralExportSettingPost {
      return {
          reimbursable_expenses_export_type: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
          reimbursable_expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value ? exportSettingsForm.get('reimbursableExpenseState')?.value : null,
          reimbursable_expense_date: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value.toUpperCase() : null,
          reimbursable_expense_grouped_by: exportSettingsForm.get('reimbursableExportGroup')?.value ? exportSettingsForm.get('reimbursableExportGroup')?.value : null,
          credit_card_expense_export_type: exportSettingsForm.get('cccExportType')?.value ? exportSettingsForm.get('cccExportType')?.value : null,
          credit_card_expense_state: exportSettingsForm.get('cccExpenseState')?.value ? exportSettingsForm.get('cccExpenseState')?.value : null,
          credit_card_expense_grouped_by: exportSettingsForm.get('cccExportGroup')?.value ? exportSettingsForm.get('cccExportGroup')?.value : null,
          credit_card_expense_date: exportSettingsForm.get('cccExportDate')?.value ? exportSettingsForm.get('cccExportDate')?.value.toUpperCase() : null,
          default_bank_account_name: exportSettingsForm.get('defaultBankName')?.value ? exportSettingsForm.get('defaultBankName')?.value.value : null,
          default_bank_account_id: exportSettingsForm.get('defaultBankName')?.value ? exportSettingsForm.get('defaultBankName')?.value.destination_id : null,
          default_ccc_bank_account_name: exportSettingsForm.get('cccDefaultBankName')?.value ? exportSettingsForm.get('cccDefaultBankName')?.value.value : null,
          default_ccc_bank_account_id: exportSettingsForm.get('cccDefaultBankName')?.value ? exportSettingsForm.get('cccDefaultBankName')?.value.destination_id : null,
          name_in_journal_entry: exportSettingsForm.get('journalEntryNamePreference')?.value ? exportSettingsForm.get('journalEntryNamePreference')?.value : null,
          employee_field_mapping: exportSettingsForm.get('reimbursableEmployeeMapping')?.value ? exportSettingsForm.get('reimbursableEmployeeMapping')?.value : null,
          auto_map_employees: exportSettingsForm.get('autoMapEmployee')?.value ? exportSettingsForm.get('autoMapEmployee')?.value : null,
          default_vendor_id: exportSettingsForm.get('defaultVendorName')?.value ? exportSettingsForm.get('defaultVendorName')?.value.destination_id : null,
          default_vendor_name: exportSettingsForm.get('defaultVendorName')?.value ? exportSettingsForm.get('defaultVendorName')?.value.value : null
      };
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable, Subject } from 'rxjs';
import { BusinessCentralExportSettingFormOption, BusinessCentralExportSettingGet, BusinessCentralExportSettingPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import { HelperService } from '../../common/helper.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { BusinessCentralDestinationAttributes } from 'src/app/core/models/business-central/db/business-central-destination-attribute.model';
import { BusinessCentralExportType, CCCExpenseState, ExpenseGroupedBy, ExpenseState, ExportDateType } from 'src/app/core/models/enum/enum.model';

const BusinessCentralExportSettingGetCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralExportSettingsService {

  private readonly workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: BusinessCentralExportSettingGetCache
  })
  getExportSettings(): Observable<BusinessCentralExportSettingGet> {
    return this.apiService.get(`workspaces/${this.workspaceId}/export_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: BusinessCentralExportSettingGetCache
  })
  postExportSettings(exportSettingsPayload: BusinessCentralExportSettingPost): Observable<BusinessCentralExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/export_settings/`, exportSettingsPayload);
  }

  getDestinationAttributes(attributeType: string[] | string): Observable<BusinessCentralDestinationAttributes[]> {
    const params = {
      attribute_type__in: attributeType
    };
    return this.apiService.get(`workspaces/${this.workspaceId}/mappings/destination_attributes/`, params);
  }

  getExpenseGroupByOptions(): BusinessCentralExportSettingFormOption[] {
    return [
      {
        label: 'Expense',
        value: ExpenseGroupedBy.EXPENSE
      },
      {
        label: 'Expense Report',
        value: ExpenseGroupedBy.REPORT
      }
    ];
  }

  getExpenseGroupingDateOptions(): BusinessCentralExportSettingFormOption[] {
    return [
      {
        label: 'Current Date',
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: 'Spent Date',
        value: ExportDateType.SPENT_AT
      },
      {
        label: 'Approval Date',
        value: ExportDateType.APPROVAL_DATE
      },
      {
        label: 'Last Spent At',
        value: ExportDateType.LAST_SPENT_AT
      }
    ];
  }

  getReimbursableExpensesExportTypeOptions(): BusinessCentralExportSettingFormOption[] {
    return [
      {
        label: 'Accounts Payable Invoice',
        value: BusinessCentralExportType.PURCHASE_INVOICE
      },
      {
        label: 'Journal Entry',
        value: BusinessCentralExportType.JOURNAL_ENTRY
      }
    ];
  }

  getCCCExpensesExportTypeOptions(): BusinessCentralExportSettingFormOption[] {
    return [
      {
        label: 'Journal Entry',
        value: BusinessCentralExportType.JOURNAL_ENTRY
      }
    ];
  }

  getExpenseState(): BusinessCentralExportSettingFormOption[] {
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
}

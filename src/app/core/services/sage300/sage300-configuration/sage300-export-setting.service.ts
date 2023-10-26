import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs/internal/Observable';
import { Sage300ExportSettingFormOption, Sage300ExportSettingGet, Sage300ExportSettingPost } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { CCCExpenseState, ExpenseGroupingFieldOption, ExpenseState, Sage300ExpenseDate, Sage300ExportType } from 'src/app/core/models/enum/enum.model';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';

const sage300ExportSettingGetCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class Sage300ExportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: sage300ExportSettingGetCache
  })
  getSage300ExportSettings(): Observable<Sage300ExportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }


  @CacheBuster({
    cacheBusterNotifier: sage300ExportSettingGetCache
  })
  postExportSettings(exportSettingsPayload: Sage300ExportSettingPost): Observable<Sage300ExportSettingGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  getDestinationAttributes(attributeType: string[] | string): Observable<Sage300DestinationAttributes> {
    const params: any = {
      attribute_type__in: attributeType
    };
    return this.apiService.get(`workspaces/${this.workspaceService.getWorkspaceId()}/mappings/destination_attributes/`, params);
  }

  getExpenseGroupByOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: 'Expense',
        value: ExpenseGroupingFieldOption.EXPENSE_ID
      },
      {
        label: 'Expense Report',
        value: ExpenseGroupingFieldOption.CLAIM_NUMBER
      }
    ];
  }

  getExpenseGroupingDateOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: 'Current Date',
        value: Sage300ExpenseDate.CURRENT_DATE
      },
      {
        label: 'Approved Date',
        value: Sage300ExpenseDate.APPROVED_AT
      },
      {
        label: 'Last Spent Date',
        value: Sage300ExpenseDate.LAST_SPEND_AT
      }
    ];
  }

  getExpensesExportTypeOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: 'Accounts Payable Invoice',
        value: Sage300ExportType.PURCHASE_INVOICE
      },
      {
        label: 'Direct Cost',
        value: Sage300ExportType.DIRECT_COST
      }
    ];
  }

  getReimbursableExpenseState(): Sage300ExportSettingFormOption[] {
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

  getCCCExpenseState(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: 'Approved',
        value: CCCExpenseState.APPROVED
      },
      {
        label: 'Closed',
        value: CCCExpenseState.PAID
      }
    ];
  }
}

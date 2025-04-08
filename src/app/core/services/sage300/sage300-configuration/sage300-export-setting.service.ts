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
import { brandingContent } from 'src/app/branding/branding-config';

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
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  getDestinationAttributes(attributeType: string[] | string): Observable<Sage300DestinationAttributes[]> {
    const params = {
      attribute_type__in: attributeType
    };
    return this.apiService.get(`workspaces/${this.workspaceService.getWorkspaceId()}/mappings/destination_attributes/`, params);
  }

  getExpenseGroupByOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: 'Expense',
        value: ExpenseGroupingFieldOption.EXPENSE
      },
      {
        label: 'Expense report',
        value: ExpenseGroupingFieldOption.REPORT
      }
    ];
  }

  getCCCExpenseGroupingDateOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: 'Card transaction post date',
        value: Sage300ExpenseDate.POSTED_AT
      },
      {
        label: 'Last spent date',
        value: Sage300ExpenseDate.LAST_SPENT_AT
      }
    ];
  }

  getReimbursableExpenseGroupingDateOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: brandingContent.common.currentDate,
        value: Sage300ExpenseDate.CURRENT_DATE
      },
      {
        label: 'Spent date',
        value: Sage300ExpenseDate.SPENT_AT
      },
      {
        label: 'Last spent date',
        value: Sage300ExpenseDate.LAST_SPENT_AT
      }
    ];
  }

  getExpensesExportTypeOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: 'Accounts payable invoice',
        value: Sage300ExportType.PURCHASE_INVOICE
      },
      {
        label: 'Direct cost',
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

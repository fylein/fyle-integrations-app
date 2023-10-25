import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs/internal/Observable';
import { Sage300ExportSettingFormOption, Sage300ExportSettingGet, sage300ExportSettingPost } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { AutoMapEmployeeOptions, CCCExpenseState, ExpenseGroupedBy, ExpenseState, FyleField, Sage300ExpenseDate, Sage300ExportType } from 'src/app/core/models/enum/enum.model';

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
  postExportSettings(exportSettingsPayload: sage300ExportSettingPost): Observable<Sage300ExportSettingGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  getExpenseGroupByOptions(): Sage300ExportSettingFormOption[] {
    const data: Sage300ExportSettingFormOption[] = [
      {
        label: 'Expense',
        value: ExpenseGroupedBy.EXPENSE
      },
      {
        label: 'Expense Report',
        value: ExpenseGroupedBy.REPORT
      }
    ];
    return data;
  }

  getExpenseGroupingDateOptions(): Sage300ExportSettingFormOption[] {
    const data: Sage300ExportSettingFormOption[] = [
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
        value: Sage300ExpenseDate.LAST_SPENT_AT
      }
    ];
    return data;
  }

  getExpensesExportTypeOptions(): Sage300ExportSettingFormOption[] {
    const data: Sage300ExportSettingFormOption[] = [
      {
        label: 'Accounts Payable Invoice',
        value: Sage300ExportType.PURCHASE_INVOICE
      },
      {
        label: 'Direct Cost',
        value: Sage300ExportType.DIRECT_COST
      }
    ];
    return data;
  }

  getReimbursableEmployeeOptions(): Sage300ExportSettingFormOption[] {
    const data: Sage300ExportSettingFormOption[] = [
      {
        label: 'Employee',
        value: FyleField.EMPLOYEE
      },
      {
        label: 'Vendor',
        value: FyleField.VENDOR
      }
    ];
    return data;
  }

  getReimbursableExpenseState(): Sage300ExportSettingFormOption[] {
    const data: Sage300ExportSettingFormOption[] = [
      {
        label: 'Processing',
        value: ExpenseState.PAYMENT_PROCESSING
      },
      {
        label: 'Closed',
        value: ExpenseState.PAID
      }
    ];
    return data;
  }

  getCCCExpenseState(): Sage300ExportSettingFormOption[] {
    const data: Sage300ExportSettingFormOption[] = [
      {
        label: 'Approved',
        value: CCCExpenseState.APPROVED
      },
      {
        label: 'Closed',
        value: CCCExpenseState.PAID
      }
    ];
    return data;
  }

  getMapEmployeeOptionsOptions(): Sage300ExportSettingFormOption[] {
    const data: Sage300ExportSettingFormOption[] = [
      {
        value: null,
        label: 'None'
      },
      {
        value: AutoMapEmployeeOptions.NAME,
        label: 'Match Names on Fyle and Sage 300 CRE'
      },
      {
        value: AutoMapEmployeeOptions.EMAIL,
        label: 'Match E-mails on Fyle and Sage 300 CRE'
      },
      {
        value: AutoMapEmployeeOptions.EMPLOYEE_CODE,
        label: 'Match Fyle Employee Code to Sage Name'
      }
    ];
    return data;
  }
}

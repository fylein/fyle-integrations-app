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
import { TranslocoService } from '@jsverse/transloco';

const sage300ExportSettingGetCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class Sage300ExportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
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
        label: this.translocoService.translate('services.sage300ExportSetting.expense'),
        value: ExpenseGroupingFieldOption.EXPENSE
      },
      {
        label: this.translocoService.translate('services.sage300ExportSetting.expenseReport'),
        value: ExpenseGroupingFieldOption.REPORT
      }
    ];
  }

  getCCCExpenseGroupingDateOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.sage300ExportSetting.cardTransactionPostDate'),
        value: Sage300ExpenseDate.POSTED_AT
      },
      {
        label: this.translocoService.translate('services.sage300ExportSetting.lastSpentDate'),
        value: Sage300ExpenseDate.LAST_SPENT_AT
      }
    ];
  }

  getReimbursableExpenseGroupingDateOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: this.translocoService.translate('common.currentDate'),
        value: Sage300ExpenseDate.CURRENT_DATE
      },
      {
        label: this.translocoService.translate('services.sage300ExportSetting.spentDate'),
        value: Sage300ExpenseDate.SPENT_AT
      },
      {
        label: this.translocoService.translate('services.sage300ExportSetting.lastSpentDate'),
        value: Sage300ExpenseDate.LAST_SPENT_AT
      }
    ];
  }

  getExpensesExportTypeOptions(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.sage300ExportSetting.accountsPayableInvoice'),
        value: Sage300ExportType.PURCHASE_INVOICE
      },
      {
        label: this.translocoService.translate('services.sage300ExportSetting.directCost'),
        value: Sage300ExportType.DIRECT_COST
      }
    ];
  }

  getReimbursableExpenseState(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.sage300ExportSetting.processing'),
        value: ExpenseState.PAYMENT_PROCESSING
      },
      {
        label: this.translocoService.translate('services.sage300ExportSetting.closed'),
        value: ExpenseState.PAID
      }
    ];
  }

  getCCCExpenseState(): Sage300ExportSettingFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.sage300ExportSetting.approved'),
        value: CCCExpenseState.APPROVED
      },
      {
        label: this.translocoService.translate('services.sage300ExportSetting.closed'),
        value: CCCExpenseState.PAID
      }
    ];
  }
}

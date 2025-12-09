import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import {
  Sage50AccountingImportDetail,
  Sage50ImportAttributesValidResponse,
} from '../../../models/sage50/db/sage50-import-attributes.model';
import { Sage50AttributeType } from 'src/app/core/models/enum/enum.model';
import { CSVImportAttributesService } from 'src/app/core/models/db/csv-import-attributes.model';

@Injectable({
  providedIn: 'root',
})
export class Sage50ImportAttributesService implements CSVImportAttributesService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
  ) {}

  getAccountingImportDetails(): Observable<Sage50AccountingImportDetail[]> {
    return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/accounting_import_details/`, {});
  }

  /**
   * Returns the accounting import details by type
   * @example {
   *   ACCOUNT: {
   *     attribute_type: 'ACCOUNT',
   *     last_uploaded_file_name: 'account.csv',
   *     imported_to_fyle_count: 10
   *     last_uploaded_on: '2025-09-26T08:32:26.408289Z'
   *   }
   * }
   */
  getAccountingImportDetailsByType(): Observable<Record<Sage50AttributeType, Sage50AccountingImportDetail>> {
    return this.getAccountingImportDetails().pipe(
      map((accountingImportDetails) => {
        const detailsByType = {} as Record<Sage50AttributeType, Sage50AccountingImportDetail>;
        for (const accountingImportDetail of accountingImportDetails) {
          const { attribute_type } = accountingImportDetail;
          detailsByType[attribute_type] = accountingImportDetail;
        }
        return detailsByType;
      }),
    );
  }

  /**
   * Returns the attribute type to file name map
   * @example {
   *   ACCOUNT: 'account.csv',
   *   VENDOR: 'vendor.csv'
   * }
   */
  getAttributeTypeToFileNameMap(): Observable<Record<Sage50AttributeType, string | null>> {
    return this.getAccountingImportDetailsByType().pipe(
      map((accountingImportDetails) => {
        const attributeTypeToFileNameMap = {} as Record<Sage50AttributeType, string | null>;
        let key: keyof typeof accountingImportDetails;
        for (key in accountingImportDetails) {
          attributeTypeToFileNameMap[key] = accountingImportDetails[key].last_uploaded_file_name;
        }
        return attributeTypeToFileNameMap;
      }),
    );
  }

  importAttributes(
    attributeType: Sage50AttributeType,
    fileName: string,
    jsonData: any,
  ): Observable<Sage50ImportAttributesValidResponse> {
    return this.apiService.post(`/${this.workspaceService.getWorkspaceId()}/import_attributes/`, {
      attribute_type: attributeType,
      file_name: fileName,
      data: jsonData,
    });
  }
}

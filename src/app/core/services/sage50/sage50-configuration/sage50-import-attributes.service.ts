import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Sage50AccountingImportDetail } from '../../../models/sage50/db/sage50-import-attributes.model';
import { Sage50AttributeType } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class Sage50ImportAttributesService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable()
  getAccountingImportDetails(): Observable<Sage50AccountingImportDetail[]> {
    return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/accounting_import_details/`, {});
  }

  getAttributeTypeToFileNameMap(): Observable<Record<Sage50AttributeType, string | null>> {
    return this.getAccountingImportDetails().pipe(
      map((accountingImportDetails) => {
        const attributeTypeToFileNameMap = {} as Record<Sage50AttributeType, string | null>;
        for (const accountingImportDetail of accountingImportDetails) {
          const {attribute_type, last_uploaded_file_name} = accountingImportDetail;
          attributeTypeToFileNameMap[attribute_type] = last_uploaded_file_name;
        }
        return attributeTypeToFileNameMap;
      })
    );
  }
}

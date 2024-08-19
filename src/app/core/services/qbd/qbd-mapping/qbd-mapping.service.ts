import { EventEmitter, Injectable, Output } from '@angular/core';
import { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';
import { Mapping, MappingPost, MappingResponse, MappingStats } from 'src/app/core/models/qbd/db/qbd-mapping.model';
import { Observable } from 'rxjs';
import { QBDExportSettingGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { MappingState } from 'src/app/core/models/enum/enum.model';
import { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class QbdMappingService {

  @Output() getMappingPagesForSideNavBar: EventEmitter<Boolean> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private workspaceService: QbdWorkspaceService
  ) { }

  getMappings(limit: number, offset: number, sourceType: string, mappingState: MappingState, itemType: string | null): Observable<MappingResponse> {
    const params: any = {
      limit,
      offset,
      attribute_type: sourceType === 'item' ? itemType : sourceType.toUpperCase()
    };

		if (mappingState === MappingState.MAPPED){
			params.destination_value__isnull = false;
		} else if (mappingState === MappingState.UNMAPPED){
			params.destination_value__isnull = true;
		}

    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd_mappings/`, params);
  }

  postMappings(mappingPayload: MappingPost): Observable<Mapping> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd_mappings/`, mappingPayload);
  }

  getMappingStats(sourceType: string, itemType?: string | null): Observable<MappingStats> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd_mappings/stats/`, {
      source_type: sourceType === 'item' ? itemType : sourceType.toUpperCase()
    });
  }

  refreshMappingPages(): void {
    this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {}).subscribe((exportSettingResponse : QBDExportSettingGet) => {
      const showMapping = exportSettingResponse.credit_card_expense_export_type ? true : false;
      this.getMappingPagesForSideNavBar.emit(showMapping);
    });
  }
}

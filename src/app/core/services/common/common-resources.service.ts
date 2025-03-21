import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { WorkspaceService } from './workspace.service';
import { Observable, share } from 'rxjs';
import { DimensionDetail, PaginatedDimensionDetails } from '../../models/db/dimension-details.model';

@Injectable({
  providedIn: 'root'
})
export class CommonResourcesService {

  /**
   * In-memory cache for display names of dimensions
   * This is set when a mapping page is visited, and can be consumed
   * by sub-pages (*BaseMappingComponent)
   */
  private dimensionDetailCache: DimensionDetail[] = [];

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) { }

  /**
   * Get the cached display name of a dimension.
   *
   * Intended for use in mapping sub-pages (*BaseMappingComponent), since the cache is
   * set in the parent page (*MappingComponent)
   * @param attributeType The attribute type of the dimension (COST_CENTER, DEPARTMENT, etc.)
   * @param sourceType The source type of the dimension (FYLE | ACCOUNTING)
   * @returns The display name of the dimension, if it exists in the cache
   */
  getCachedDisplayName(
    { attributeType, sourceType }:
    { attributeType: string, sourceType: 'FYLE' | 'ACCOUNTING' }
  ): string | undefined {
    const cachedDimensionDetail = this.dimensionDetailCache.find(
      (dimensionDetail) =>
        dimensionDetail.attribute_type === attributeType &&
        dimensionDetail.source_type === sourceType
    );


    return cachedDimensionDetail?.display_name;
  }

  getDimensionDetails(
    { attributeTypes, sourceType, keepOldCache = false }:
    { attributeTypes: string[], sourceType: 'FYLE' | 'ACCOUNTING', keepOldCache?: boolean }
  ): Observable<PaginatedDimensionDetails> {
    this.helper.setBaseApiURL();

    const params: Record<string, string[] | string | number> = {
      attribute_type__in: attributeTypes,
      source_type: sourceType,
      offset: 0,
      limit: 100
    };

    const observable = this.apiService.get(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/common_resources/dimension_details/`,
      params
    ).pipe(share());

    observable.subscribe(
      (paginatedDimensionDetails) => {
        // Clear the cache by default - this is the case when calling this method for the first time
        // Explicitly set keepOldCache to true when we want to store multiple responses in the cache
        if (keepOldCache) {
          this.dimensionDetailCache.push(...paginatedDimensionDetails.results);
        } else {
          this.dimensionDetailCache = [...paginatedDimensionDetails.results];
        }
      }
    );

    return observable;
  }
}

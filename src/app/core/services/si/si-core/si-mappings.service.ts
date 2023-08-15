import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { SiApiService } from './si-api.service';
import { SiWorkspaceService } from './si-workspace.service';

@Injectable({
  providedIn: 'root'
})
export class SiMappingsService {

  constructor(
    private apiService: SiApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  refreshSageIntacctDimensions(dimensionsToSync: string[] = []) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/sage_intacct/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  }

  getSageIntacctDestinationAttributes(attributeTypes: string | string[], accountType?: string, active?: boolean): Observable<DestinationAttribute[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {attribute_types: string | string[], account_type?: string, active?: boolean} = {
      attribute_types: attributeTypes
    };

    if (accountType) {
      params.account_type = accountType;
    }
    if (active) {
      params.active = active;
    }

    return this.apiService.get(`/workspaces/${workspaceId}/sage_intacct/destination_attributes/`, params);
  }

  getSageIntacctAccounts(accountType?: string, active?: boolean): Observable<DestinationAttribute[]> {
    return from(this.getSageIntacctDestinationAttributes(['ACCOUNT'], accountType, active).toPromise())
      .pipe(
        map((response: DestinationAttribute[] | undefined) => {
          if (!response) {
            return []; // Handle the case when response is undefined
          }
          return response.filter(attribute => attribute.attribute_type === 'ACCOUNT');
        })
      );
  }

  getSageIntacctExpensePaymentType(accountType?: string, active?: boolean): Observable<DestinationAttribute[]> {
    return from(this.getSageIntacctDestinationAttributes(['EXPENSE_PAYMENT_TYPE'], accountType, active).toPromise())
      .pipe(
        map((response: DestinationAttribute[] | undefined) => {
          if (!response) {
            return []; // Handle the case when response is undefined
          }
          return response.filter(attribute => attribute.attribute_type === 'EXPENSE_PAYMENT_TYPE');
        })
      );
  }

  getSageIntacctVendors(accountType?: string, active?: boolean): Observable<DestinationAttribute[]> {
    return from(this.getSageIntacctDestinationAttributes(['VENDOR'], accountType, active).toPromise())
      .pipe(
        map((response: DestinationAttribute[] | undefined) => {
          if (!response) {
            return []; // Handle the case when response is undefined
          }
          return response.filter(attribute => attribute.attribute_type === 'VENDOR');
        })
      );
  }
}

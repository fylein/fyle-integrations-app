import { Injectable } from '@angular/core';
import { AppUrl } from '../../models/enum/enum.model';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs';
import { Integration } from '../../models/integrations/integrations.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {
  constructor(
    private apiService: ApiService,
    private helper: HelperService
  ) {
  }

  getIntegrations(): Observable<Integration[]> {
    this.helper.setBaseApiURL(AppUrl.INTEGRATION);
    return this.apiService.get(`/integrations/`, {});
  }
}

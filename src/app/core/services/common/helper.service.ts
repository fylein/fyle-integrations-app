import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { AppUrlMap } from '../../models/integrations/integrations.model';
import { AppUrl } from '../../models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  setBaseApiURL(): void {
    const urlSplit = this.router.url.split('/');
    const module:AppUrl = (urlSplit.length > 2 ? urlSplit[2] : urlSplit[1]) as AppUrl;
    const apiUrlMap: AppUrlMap = {
      [AppUrl.INTACCT]: environment.si_api_url,
      [AppUrl.QBD]: environment.qbd_api_url,
      [AppUrl.TRAVELPERK]: environment.api_url,
      [AppUrl.BAMBOO_HR]: environment.api_url,
      [AppUrl.GUSTO]: environment.api_url,
      [AppUrl.SAGE300]: environment.api_url,
      [AppUrl.INTEGRATION]: environment.api_url
    };

    this.apiService.setBaseApiURL(apiUrlMap[module]);
  }

  getAppName(): string {
    const appName = this.router.url.split('/')[2];
    return appName;
  }
}

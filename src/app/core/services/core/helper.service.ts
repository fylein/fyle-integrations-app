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

  callSetBaseApiURL() {
    const urlarray = this.router.url.split('/');
    const api_url = urlarray.length > 2 ? urlarray[2] : urlarray[1];
    const api_urls: AppUrlMap = {
      [AppUrl.INTACCT]: environment.si_api_url,
      [AppUrl.QBD]: environment.qbd_api_url,
      [AppUrl.TRAVELPERK]: environment.api_url,
      [AppUrl.BAMBOO_HR]: environment.api_url,
      [AppUrl.INTEGRATION]: environment.api_url
    };

    this.apiService.setBaseApiURL(api_urls[api_url]);
  }

  getAppName(): string {
    const appName = this.router.url.split('/')[2];
    return appName;
  }
}

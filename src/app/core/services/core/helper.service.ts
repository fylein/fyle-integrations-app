import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { SiApiService } from '../si/si-core/si-api.service';
import { DashboardService } from '../si/si-core/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  callSetBaseApiURL() {
    const urlarray = this.router.url.split('/')
    let api_url;
    // for integration-setting-api we can use the length of the url split
    // if the length is > 2 we can use the url to select the api url for app[]
    // else we can select the integration-setting-api url
    const apps: { [key: string]: string } = {
        'intacct': environment.si_api_url,
        'qbd': environment.qbd_api_url,
        'travelperk' : environment.api_url,
        'integration': environment.api_url
    };
    if(urlarray.length > 2) {
      api_url = urlarray[2]
    }
    else {
      api_url = urlarray[1]
    }
    this.apiService.setBaseApiURL(apps[api_url])
  }
}
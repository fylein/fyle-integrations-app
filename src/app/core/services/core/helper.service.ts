import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

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
    const api_urls: { [key: string]: string } = {
      'intacct': environment.si_api_url,
      'qbd': environment.qbd_api_url,
      'travelperk': environment.api_url,
      'bamboohr': environment.api_url,
      'integration': environment.api_url
    };

    this.apiService.setBaseApiURL(api_urls[api_url]);
  }

  getAppName() {
    const appName = this.router.url.split('/')[2];
    return appName;
  }
}

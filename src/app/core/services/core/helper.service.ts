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

  setBaseApiURL(): void {
    const urlSplit = this.router.url.split('/');
    const module = urlSplit.length > 2 ? urlSplit[2] : urlSplit[1];
    const apiUrlMap: { [key: string]: string } = {
      'intacct': environment.si_api_url,
      'qbd': environment.qbd_api_url,
      'travelperk': environment.api_url,
      'bamboohr': environment.api_url,
      'integration': environment.api_url
    };

    this.apiService.setBaseApiURL(apiUrlMap[module]);
  }
}

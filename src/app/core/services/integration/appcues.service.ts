import { Injectable } from '@angular/core';
import { UserService } from '../misc/user.service';
import { AppName } from '../../models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class AppcuesService {

  constructor(
    private userService: UserService
  ) { }

  get appcues() {
    return (window as any).Appcues;
  }

  initialiseAppcues(appName: AppName): void {
    if (this.appcues) {
      const user = this.userService.getUserProfile();
      this.appcues.identify(user.user_id, {
        email: user.email,
        name: user.full_name,
        'Org ID': user.org_id,
        'Workspace Name': user.org_name,
        source: 'Fyle Integration Settings',
        'App Name': appName
      });
    }
  }
}

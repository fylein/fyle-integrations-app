import { Injectable } from '@angular/core';
import { UserService } from '../misc/user.service';
import { AppName } from '../../models/enum/enum.model';
import { MinimalUser } from '../../models/db/user.model';

@Injectable({
  providedIn: 'root'
})
export class AppcuesService {

  user: MinimalUser = this.userService.getUserProfile();

  constructor(
    private userService: UserService
  ) { }

  get appcues() {
    return (window as any).Appcues;
  }

  initialiseAppcues(appName: AppName, workspace_created_at: Date): void {
    workspace_created_at = new Date(workspace_created_at);
    if (this.appcues) {
      const user = this.userService.getUserProfile();
      this.appcues.identify(user.user_id, {
        'org_id': user.org_id,
        'user_id': user.user_id,
        source: 'Fyle Integrations App',
        'app_name': appName
      });
    }
  }
}

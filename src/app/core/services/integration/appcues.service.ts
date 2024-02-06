import { Injectable } from '@angular/core';
import { UserService } from '../misc/user.service';
import { AppName } from '../../models/enum/enum.model';
import { SiWorkspaceService } from '../si/si-core/si-workspace.service';
import { MinimalUser } from '../../models/db/user.model';
import { IntacctWorkspace } from '../../models/intacct/db/workspaces.model';

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
        email: user.email,
        name: user.full_name,
        'Org ID': user.org_id,
        'Workspace Name': user.org_name,
        source: 'Fyle Integration Settings',
        'App Name': appName,
        'Flow Version': workspace_created_at > new Date('2023-10-03T07:30:00.000Z') ? 'NEW' : 'OLD'
      });
    }
  }
}

import { Injectable } from '@angular/core';
import type { MinimalUser } from '../../models/db/user.model';
import type { AppName, RefinerSurveyType } from '../../models/enum/enum.model';
import type { UserService } from '../misc/user.service';

@Injectable({
  providedIn: 'root'
})
export class RefinerService {

  private readonly user: MinimalUser = this.userService.getUserProfile();

  constructor(
    private userService: UserService
  ) { }

  get refiner() {
    return (window as any)._refiner;
  }

  triggerSurvey(appName: AppName, surveyID: string, actionName: RefinerSurveyType): void {
    if (this.refiner) {
      this.refiner('identifyUser', {
        id: this.user.org_id,
        email: this.user.email,
        name: this.user.full_name,
        account: {
          workspace_name: this.user.org_name
        },
        source: 'Fyle Integration Settings',
        action_name: actionName,
        'App Name': appName
      });
      this.refiner('showForm', surveyID);
    }
  }
}

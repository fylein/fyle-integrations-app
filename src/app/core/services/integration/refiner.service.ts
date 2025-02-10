import { Injectable } from '@angular/core';
import { MinimalUser } from '../../models/db/user.model';
import { AppName, RefinerSurveyType } from '../../models/enum/enum.model';
import { UserService } from '../misc/user.service';

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
        account: {
          workspace_id: this.user.org_id
        },
        source: 'Fyle Integration Settings',
        action_name: actionName,
        'App Name': appName
      });
      this.refiner('showForm', surveyID);
    }
  }
}

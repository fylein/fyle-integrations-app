import { Injectable } from '@angular/core';
import { MinimalUser } from '../../models/db/user.model';
import { AppName, RefinerSurveyType } from '../../models/enum/enum.model';
import { UserService } from '../misc/user.service';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class RefinerService {

  private readonly user: MinimalUser = this.userService.getUserProfile();

  constructor(
    private userService: UserService,
    private translocoService: TranslocoService
  ) { }

  get refiner() {
    return (window as any)._refiner;
  }

  triggerSurvey(appName: AppName, surveyID: string, actionName: RefinerSurveyType): void {
    if (this.refiner) {
      this.refiner('identifyUser', {
        id: this.user.org_id,
        account: {
          org_id: this.user.org_id
        },
        source: this.translocoService.translate('services.refiner.sourceFyleIntegrationSettings'),
        action_name: actionName,
        'App Name': appName
      });
      this.refiner('showForm', surveyID);
    }
  }
}

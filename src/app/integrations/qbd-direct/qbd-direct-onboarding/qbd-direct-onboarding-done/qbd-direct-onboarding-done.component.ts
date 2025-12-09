import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppName, RefinerSurveyType } from 'src/app/core/models/enum/enum.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qbd-direct-onboarding-done',
  imports: [SharedModule],
  templateUrl: './qbd-direct-onboarding-done.component.html',
  styleUrl: './qbd-direct-onboarding-done.component.scss',
})
export class QbdDirectOnboardingDoneComponent {
  constructor(
    private router: Router,
    private refinerService: RefinerService,
  ) {}

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/qbd_direct/main/dashboard`]);
    this.refinerService.triggerSurvey(
      AppName.QBD_DIRECT,
      environment.refiner_survey.qbd.onboarding_done_survery_id,
      RefinerSurveyType.ONBOARDING_DONE,
    );
  }
}

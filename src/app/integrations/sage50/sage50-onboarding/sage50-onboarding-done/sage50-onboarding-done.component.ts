import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppName, ClickEvent, RefinerSurveyType, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sage50-onboarding-done',
  imports: [SharedModule],
  templateUrl: './sage50-onboarding-done.component.html',
  styleUrl: './sage50-onboarding-done.component.scss',
})
export class Sage50OnboardingDoneComponent {
  constructor(
    private router: Router,
    private trackingService: TrackingService,
    private refinerService: RefinerService,
  ) {}

  navigateToDashboard() {
    this.trackingService.onClickEvent(TrackingApp.SAGE50, ClickEvent.LAUNCH_INTEGRATION);
    this.router.navigate([`/integrations/sage50/main/dashboard`]);
    this.refinerService.triggerSurvey(
      AppName.SAGE50,
      environment.refiner_survey.sage50.onboarding_done_survery_id,
      RefinerSurveyType.ONBOARDING_DONE,
    );
  }
}

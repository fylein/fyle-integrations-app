import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppName, RefinerSurveyType } from 'src/app/core/models/enum/enum.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  constructor(
    private refinerService: RefinerService,
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/intacct/main`]);
    this.refinerService.triggerSurvey(
      AppName.INTACCT, environment.refiner_survey.intacct.onboarding_done_survery_id, RefinerSurveyType.ONBOARDING_DONE
    );
  }

  ngOnInit(): void {
  }

}

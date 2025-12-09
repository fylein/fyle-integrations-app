import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, RefinerSurveyType } from 'src/app/core/models/enum/enum.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-intacct-onboarding-done',
  templateUrl: './intacct-onboarding-done.component.html',
  styleUrls: ['./intacct-onboarding-done.component.scss'],
  standalone: false,
})
export class IntacctOnboardingDoneComponent implements OnInit {
  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private refinerService: RefinerService,
    private router: Router,
  ) {}

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/intacct/main`]);
    this.refinerService.triggerSurvey(
      AppName.INTACCT,
      environment.refiner_survey.intacct.onboarding_done_survery_id,
      RefinerSurveyType.ONBOARDING_DONE,
    );
  }

  ngOnInit(): void {}
}

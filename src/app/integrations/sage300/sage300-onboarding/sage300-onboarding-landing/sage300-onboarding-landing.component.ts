import { Component, OnInit } from '@angular/core';
import { Sage300Link, EmbedVideoLink, AppName, QBDOnboardingState, Sage300OnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { Sage300OnboardingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-onboarding.service';

@Component({
  selector: 'app-sage300-onboarding-landing',
  templateUrl: './sage300-onboarding-landing.component.html',
  styleUrls: ['./sage300-onboarding-landing.component.scss']
})
export class Sage300OnboardingLandingComponent implements OnInit {

  redirectLink = Sage300Link.LANDING;

  EmbedVideo = EmbedVideoLink;

  constructor() { }

  ngOnInit(): void {
  }

}

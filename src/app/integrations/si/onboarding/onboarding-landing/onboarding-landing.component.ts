import { Component, OnInit } from '@angular/core';
import { RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  RedirectLink = RedirectLink;

  isSISetupInProgress: boolean = false;

  isSIConnected: boolean = false;

  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  appName: AppName = AppName.INTACCT;

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.INTACCT;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

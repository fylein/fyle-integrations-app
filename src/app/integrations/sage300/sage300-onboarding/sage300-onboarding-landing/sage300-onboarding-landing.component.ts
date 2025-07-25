import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
    selector: 'app-sage300-onboarding-landing',
    templateUrl: './sage300-onboarding-landing.component.html',
    styleUrls: ['./sage300-onboarding-landing.component.scss'],
    standalone: false
})
export class Sage300OnboardingLandingComponent implements OnInit {

  appName: AppName = AppName.SAGE300;

  redirectLink = brandingKbArticles.onboardingArticles.SAGE300.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.SAGE300;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

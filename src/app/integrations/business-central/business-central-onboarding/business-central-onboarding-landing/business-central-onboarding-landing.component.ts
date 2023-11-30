import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-business-central-onboarding-landing',
  templateUrl: './business-central-onboarding-landing.component.html',
  styleUrls: ['./business-central-onboarding-landing.component.scss']
})
export class BusinessCentralOnboardingLandingComponent implements OnInit {
  redirectLink = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.BUSINESS_CENTRAL;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

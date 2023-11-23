import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-sage300-onboarding-landing',
  templateUrl: './sage300-onboarding-landing.component.html',
  styleUrls: ['./sage300-onboarding-landing.component.scss']
})
export class Sage300OnboardingLandingComponent implements OnInit {

  redirectLink = brandingKbArticles.onboardingArticles.SAGE300.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.SAGE300;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.INTACCT;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

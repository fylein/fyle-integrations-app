import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-qbo-onboarding-landing',
  templateUrl: './qbo-onboarding-landing.component.html',
  styleUrls: ['./qbo-onboarding-landing.component.scss']
})
export class QboOnboardingLandingComponent implements OnInit {

  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.onboardingArticles.QBO.CONNECTOR;

  embedVideoLink = brandingDemoVideoLinks.onboarding.QBO;

  constructor() { }

  ngOnInit(): void {
  }

}

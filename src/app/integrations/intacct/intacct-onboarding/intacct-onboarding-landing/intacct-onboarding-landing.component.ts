import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingContent, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-intacct-onboarding-landing',
  templateUrl: './intacct-onboarding-landing.component.html',
  styleUrls: ['./intacct-onboarding-landing.component.scss']
})
export class IntacctOnboardingLandingComponent implements OnInit {

  appName: AppName = AppName.INTACCT;

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.INTACCT;

  readonly brandingConfig = brandingConfig;

  brandingContent = brandingContent;

  constructor() { } 

  ngOnInit(): void {
  }

}

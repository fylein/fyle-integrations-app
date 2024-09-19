import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { brandingConfig, brandingContent, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';


@Component({
  selector: 'app-netsuite-onboarding-landing',
  templateUrl: './netsuite-onboarding-landing.component.html',
  styleUrls: ['./netsuite-onboarding-landing.component.scss']
})
export class NetsuiteOnboardingLandingComponent implements OnInit {

  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.onboardingArticles.NETSUITE.CONNECTOR;

  embedVideoLink = brandingDemoVideoLinks.onboarding.NETSUITE;

  brandingContent = brandingContent.netsuite.landing;

  constructor() { }

  ngOnInit(): void {
  }

}

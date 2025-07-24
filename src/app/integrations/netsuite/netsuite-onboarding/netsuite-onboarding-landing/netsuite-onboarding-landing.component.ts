import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';


@Component({
    selector: 'app-netsuite-onboarding-landing',
    templateUrl: './netsuite-onboarding-landing.component.html',
    styleUrls: ['./netsuite-onboarding-landing.component.scss'],
    standalone: false
})
export class NetsuiteOnboardingLandingComponent implements OnInit {

  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.onboardingArticles.NETSUITE.CONNECTOR;

  embedVideoLink = brandingDemoVideoLinks.onboarding.NETSUITE;

  constructor() { }

  ngOnInit(): void {
  }

}

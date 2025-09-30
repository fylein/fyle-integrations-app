import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { BrandingService } from 'src/app/core/services/common/branding.service';


@Component({
  selector: 'app-netsuite-onboarding-landing',
  templateUrl: './netsuite-onboarding-landing.component.html',
  styleUrls: ['./netsuite-onboarding-landing.component.scss']
})
export class NetsuiteOnboardingLandingComponent implements OnInit {

  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.onboardingArticles.NETSUITE.CONNECTOR;

  embedVideoLink = brandingDemoVideoLinks.onboarding.NETSUITE;

  constructor(public brandingService: BrandingService) { }

  ngOnInit(): void {
  }

}

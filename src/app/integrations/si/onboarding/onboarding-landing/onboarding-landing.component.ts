import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { EmbedVideoLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.LANDING;

  EmbedVideo = EmbedVideoLink;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

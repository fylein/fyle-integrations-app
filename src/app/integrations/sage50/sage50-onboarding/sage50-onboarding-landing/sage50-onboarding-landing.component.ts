import { Component } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sage50-onboarding-landing',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sage50-onboarding-landing.component.html',
  styleUrl: './sage50-onboarding-landing.component.scss'
})
export class Sage50OnboardingLandingComponent {
  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.onboardingArticles.SAGE50.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.SAGE50;

  appName: AppName = AppName.SAGE50;
}

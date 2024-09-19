import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  @Output() launchIntegrationClick = new EventEmitter();

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent.configuration.done;

  constructor() { }

  navigateToDashboard(): void {
    this.launchIntegrationClick.emit();
  }

  ngOnInit(): void {
  }

}

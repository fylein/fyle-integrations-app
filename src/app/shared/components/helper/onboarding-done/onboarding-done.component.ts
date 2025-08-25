import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  @Output() launchIntegrationClick = new EventEmitter();

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  buttonType = ButtonType;

  buttonSize = ButtonSize;

  constructor() { }

  navigateToDashboard(): void {
    this.launchIntegrationClick.emit();
  }

  ngOnInit(): void {
  }

}

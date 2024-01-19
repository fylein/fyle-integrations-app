import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  @Output() launchIntegrationClick = new EventEmitter();

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor() { }

  navigateToDashboard(): void {
    this.launchIntegrationClick.emit();
  }

  ngOnInit(): void {
  }

}

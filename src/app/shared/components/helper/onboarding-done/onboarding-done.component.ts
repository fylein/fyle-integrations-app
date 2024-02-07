import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  @Input() headerText: string = 'Congratulations! Your integration setup is now complete.';

  @Input() subText: string = 'After launching the integration, you can change your settings at any point of time under the <b class="tw-font-bold">Configuration</b> section.';

  @Input() btnText: string = 'Launch Integration';

  @Output() launchIntegrationClick = new EventEmitter();

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor() { }

  navigateToDashboard(): void {
    this.launchIntegrationClick.emit();
  }

  ngOnInit(): void {
  }

}

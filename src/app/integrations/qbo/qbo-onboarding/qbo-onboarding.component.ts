import { Component, OnInit } from '@angular/core';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
    selector: 'app-qbo-onboarding',
    templateUrl: './qbo-onboarding.component.html',
    styleUrls: ['./qbo-onboarding.component.scss'],
    standalone: false
})
export class QboOnboardingComponent implements OnInit {

  brandingFeatureConfig = brandingFeatureConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

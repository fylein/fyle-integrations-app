import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/qbd/main`]);
  }

  ngOnInit(): void {
  }

}

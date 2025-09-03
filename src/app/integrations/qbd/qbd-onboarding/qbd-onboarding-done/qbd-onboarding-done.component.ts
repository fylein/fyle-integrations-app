import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-qbd-onboarding-done',
  templateUrl: './qbd-onboarding-done.component.html',
  styleUrls: ['./qbd-onboarding-done.component.scss']
})
export class QbdOnboardingDoneComponent implements OnInit {

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  constructor(
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/qbd/main`]);
  }

  ngOnInit(): void {
  }

}

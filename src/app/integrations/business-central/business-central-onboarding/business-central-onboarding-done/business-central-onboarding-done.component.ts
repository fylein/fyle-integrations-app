import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-central-onboarding-done',
  templateUrl: './business-central-onboarding-done.component.html',
  styleUrls: ['./business-central-onboarding-done.component.scss']
})
export class BusinessCentralOnboardingDoneComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/business_central/main/dashboard`]);
  }

  ngOnInit(): void {
  }

}

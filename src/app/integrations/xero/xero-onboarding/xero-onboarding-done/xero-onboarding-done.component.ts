import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';

@Component({
  selector: 'app-xero-onboarding-done',
  templateUrl: './xero-onboarding-done.component.html',
  styleUrls: ['./xero-onboarding-done.component.scss']
})
export class XeroOnboardingDoneComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/xero/main/dashboard`]);
  }

  ngOnInit(): void {
  }

}

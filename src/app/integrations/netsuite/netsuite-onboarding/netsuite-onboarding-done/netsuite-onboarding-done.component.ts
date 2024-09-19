import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';

@Component({
  selector: 'app-netsuite-onboarding-done',
  templateUrl: './netsuite-onboarding-done.component.html',
  styleUrls: ['./netsuite-onboarding-done.component.scss']
})
export class NetsuiteOnboardingDoneComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/netsuite/main/dashboard`]);
  }

  ngOnInit(): void {
  }
}

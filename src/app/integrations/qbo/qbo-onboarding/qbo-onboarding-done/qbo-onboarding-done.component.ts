import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';

@Component({
  selector: 'app-qbo-onboarding-done',
  templateUrl: './qbo-onboarding-done.component.html',
  styleUrls: ['./qbo-onboarding-done.component.scss']
})
export class QboOnboardingDoneComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/qbo/main/dashboard`]);
  }

  ngOnInit(): void {
  }

}

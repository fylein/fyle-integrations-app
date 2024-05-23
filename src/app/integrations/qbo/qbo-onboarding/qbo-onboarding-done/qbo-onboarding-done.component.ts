import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qbo-onboarding-done',
  templateUrl: './qbo-onboarding-done.component.html',
  styleUrls: ['./qbo-onboarding-done.component.scss']
})
export class QboOnboardingDoneComponent implements OnInit {

  constructor(
    @Inject(Router) private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/qbo/main/dashboard`]);
  }

  ngOnInit(): void {
  }

}

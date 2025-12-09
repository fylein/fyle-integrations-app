import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sage300-onboarding-done',
  templateUrl: './sage300-onboarding-done.component.html',
  styleUrls: ['./sage300-onboarding-done.component.scss'],
  standalone: false,
})
export class Sage300OnboardingDoneComponent implements OnInit {
  constructor(private router: Router) {}

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/sage300/main`]);
  }

  ngOnInit(): void {}
}

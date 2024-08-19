import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qbd-onboarding',
  templateUrl: './qbd-onboarding.component.html',
  styleUrls: ['./qbd-onboarding.component.scss']
})
export class QbdOnboardingComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}

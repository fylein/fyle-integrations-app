import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-travelperk-onboarding-done',
  templateUrl: './travelperk-onboarding-done.component.html',
  styleUrls: ['./travelperk-onboarding-done.component.scss']
})
export class TravelperkOnboardingDoneComponent implements OnInit {

  headerText: string = 'Congratulations! <p class="tw-pt-10-px">Your Configuration Setup is now Complete.</p>';

  constructor(
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/travelperk/main/configuration`]);
  }


  ngOnInit(): void {
  }

}

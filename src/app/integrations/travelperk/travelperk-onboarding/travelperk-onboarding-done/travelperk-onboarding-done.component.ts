import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-travelperk-onboarding-done',
  templateUrl: './travelperk-onboarding-done.component.html',
  styleUrls: ['./travelperk-onboarding-done.component.scss']
})
export class TravelperkOnboardingDoneComponent implements OnInit {

  headerText: string;

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/travelperk/main/configuration`]);
  }


  ngOnInit(): void {
    this.headerText = this.translocoService.translate('travelperkOnboardingDone.headerText');
  }

}

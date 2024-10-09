import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-onboarding-done',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './qbd-direct-onboarding-done.component.html',
  styleUrl: './qbd-direct-onboarding-done.component.scss'
})
export class QbdDirectOnboardingDoneComponent {

  constructor(
    private router: Router
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/integrations/qbd_direct/main/dashboard`]);
  }

}

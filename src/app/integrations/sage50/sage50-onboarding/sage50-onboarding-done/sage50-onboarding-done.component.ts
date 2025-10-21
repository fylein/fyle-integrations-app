import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sage50-onboarding-done',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sage50-onboarding-done.component.html',
  styleUrl: './sage50-onboarding-done.component.scss'
})
export class Sage50OnboardingDoneComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate([`/integrations/sage50/main/dashboard`]);
  }
}

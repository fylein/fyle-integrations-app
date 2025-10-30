import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClickEvent, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sage50-onboarding-done',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sage50-onboarding-done.component.html',
  styleUrl: './sage50-onboarding-done.component.scss'
})
export class Sage50OnboardingDoneComponent {
  constructor(private router: Router, private trackingService: TrackingService) {}

  navigateToDashboard() {
    this.trackingService.onClickEvent(TrackingApp.SAGE50, ClickEvent.LAUNCH_INTEGRATION);
    this.router.navigate([`/integrations/sage50/main/dashboard`]);
  }
}

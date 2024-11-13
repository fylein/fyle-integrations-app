import { Component } from '@angular/core';
import { QbdDirectSharedModule } from '../../qbd-direct-shared/qbd-direct-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-onboarding-connector',
  standalone: true,
  imports: [QbdDirectSharedModule, SharedModule],
  templateUrl: './qbd-direct-onboarding-connector.component.html',
  styleUrl: './qbd-direct-onboarding-connector.component.scss'
})
export class QbdDirectOnboardingConnectorComponent {

}

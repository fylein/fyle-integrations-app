import { Component, OnInit } from '@angular/core';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';

@Component({
  selector: 'app-onboarding-intacct-connector',
  templateUrl: './onboarding-intacct-connector.component.html',
  styleUrls: ['./onboarding-intacct-connector.component.scss']
})
export class OnboardingIntacctConnectorComponent implements OnInit {

  isLoading: boolean;

  isIntacctConnected: boolean = false;

  constructor() { }

  isConnected(eventData: boolean) {
    this.isIntacctConnected = eventData;
  }

  ngOnInit(): void {
  }
}

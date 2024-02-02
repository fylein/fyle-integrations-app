import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding-intacct-connector',
  templateUrl: './intacct-onboarding-connector.component.html',
  styleUrls: ['./intacct-onboarding-connector.component.scss']
})
export class IntacctOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isIntacctConnected: boolean = false;

  constructor() { }

  setupConnectionStatus(eventData: boolean) {
    this.isIntacctConnected = eventData;
  }

  ngOnInit(): void {
  }
}

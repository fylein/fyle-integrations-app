import { Component, EventEmitter, INJECTOR, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-configuration-connector',
  templateUrl: './configuration-connector.component.html',
  styleUrls: ['./configuration-connector.component.scss']
})
export class ConfigurationConnectorComponent implements OnInit {

  @Input() fyleOrgName: string;

  @Input() accountingAppTitle: string;

  @Input() accountingCompanyName: string;

  @Input() switchLinkTex: string;

  @Input() isAccountingCompanyConnected: boolean;

  @Input() accountingCompanyConnectionInProgress: boolean;

  @Input() accountingCompanyTokenExpired: boolean;

  @Input() showDisconnect: boolean;

  @Output() switchCompany = new EventEmitter();

  @Output() connectCompany = new EventEmitter();


  constructor() { }

  disconnect() {
    this.switchCompany.emit();
  }

  connect() {
    this.connectCompany.emit();
  }

  ngOnInit(): void {
  }

}

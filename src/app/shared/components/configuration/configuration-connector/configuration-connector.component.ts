import { Component, EventEmitter, INJECTOR, Input, OnInit, Output } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-configuration-connector',
  templateUrl: './configuration-connector.component.html',
  styleUrls: ['./configuration-connector.component.scss']
})
export class ConfigurationConnectorComponent implements OnInit {

  @Input() fyleOrgName: string;

  @Input() accountingAppTitle: string;

  @Input() accountingCompanyName: string | null;

  @Input() switchLinkText: string;

  @Input() isAccountingCompanyConnected: boolean;

  @Input() accountingCompanyConnectionInProgress: boolean;

  @Input() accountingCompanyTokenExpired: boolean;

  @Input() showDisconnect: boolean;

  @Output() switchCompany = new EventEmitter();

  @Output() connectCompany = new EventEmitter();

  readonly brandingConfig = brandingConfig;

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

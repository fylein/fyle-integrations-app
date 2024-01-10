import { Component, EventEmitter, INJECTOR, Input, OnInit, Output } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';
import { BusinessCentralDestinationAttributes } from 'src/app/core/models/business-central/db/business-central-destination-attribute.model';

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

  @Input() accountingCompanyList: BusinessCentralDestinationAttributes[];

  @Output() switchCompany = new EventEmitter();

  @Output() connectCompany = new EventEmitter();

  readonly brandingConfig = brandingConfig;

  companyName: BusinessCentralDestinationAttributes;

  constructor() { }

  disconnect() {
    this.switchCompany.emit();
  }

  connect() {
    this.connectCompany.emit(this.companyName);
  }

  ngOnInit(): void {
  }

}

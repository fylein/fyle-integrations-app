import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';

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

  @Input() accountingCompanyList: DestinationAttribute[];

  @Input() isDisconnectClicked: boolean = false;

  @Output() switchCompany = new EventEmitter();

  @Output() connectCompany = new EventEmitter();

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  companyName: DestinationAttribute;

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

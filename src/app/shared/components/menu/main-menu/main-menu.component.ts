import { Component, EventEmitter, Input, OnInit, Output, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingIntegrationApp, AppName, InAppIntegration } from 'src/app/core/models/enum/enum.model';
import { Integration, integrationCallbackUrlMap } from 'src/app/core/models/integrations/integrations.model';
import { MainMenuDropdownGroup } from 'src/app/core/models/misc/main-menu-dropdown-options';
import { EventsService } from 'src/app/core/services/common/events.service';
import { IntegrationsService } from 'src/app/core/services/common/integrations.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() activeItem: MenuItem;

  @Input() dropdownValue = null;

  @Input() appName: string = '';

  @Input() isDropdrownRequired: boolean;

  @Input() isSyncVisible: boolean;

  @Input() isDisconnectRequired: boolean = false;

  @Input() isConnectionInProgress: boolean;

  @Input() toolTipText: string = 'The integration will import all the newly updated ' + this.appName + ' dimensions and ' + brandingConfig.brandName + ' expenses in the configured state of export';

  @Output() refreshDimensionClick = new EventEmitter<boolean>();

  @Output() disconnectClick = new EventEmitter();

  private pDropdown = viewChild(Dropdown);

  dropdownOptions: MainMenuDropdownGroup[];

  isDisabled: boolean = false;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private router: Router,
    private integrationsService: IntegrationsService,
    private eventsService: EventsService
  ) { }

  handleDropdownChange(event: any) {
    if (event.value === null) {
      return;
    }

    event.value.handler();
    this.pDropdown()?.clear();
  }

  disconnect() {
    this.isDisabled = true;
    this.disconnectClick.emit();
  }

  refreshDimensions() {
    this.refreshDimensionClick.emit(true);
  }

  isCurrentIntegration(integrationName: InAppIntegration) {
    return this.router.url.includes(
      this.integrationsService.inAppIntegrationUrlMap[integrationName]
    );
  }

  private addDropdownOptions(integrations: Integration[]) {
    const options: MainMenuDropdownGroup[] = [
      {
        label: 'Integrations',
        items: [
          {
            label: 'Add more integrations',
            handler: () => {
              this.router.navigate(['/integrations/landing_v2']);
            }
          }
        ]
      }
    ];

    /**
     * Iterate backwards because the most recently connected integration
     * at integrations[0] should be unshifted last
     */
    for (let i = integrations.length - 1; i >= 0; i--) {
      const integration = integrations[i];
      const integrationName = this.integrationsService.getIntegrationName(integration.tpa_name);
      if (integrationName === null) {
        continue;
      }

      options[0].items.unshift({
        label: integrationName,
        handler: () => {
          let accountingIntegrationApp: AccountingIntegrationApp;
          if (integrationName === InAppIntegration.NETSUITE) {
            accountingIntegrationApp = AccountingIntegrationApp.NETSUITE;
          } else if (integrationName === InAppIntegration.INTACCT) {
            accountingIntegrationApp = AccountingIntegrationApp.SAGE_INTACCT;
          } else if (integrationName === InAppIntegration.QBO) {
            accountingIntegrationApp = AccountingIntegrationApp.QBO;
          } else if (integrationName === InAppIntegration.XERO) {
            accountingIntegrationApp = AccountingIntegrationApp.XERO;
          } else {
            this.integrationsService.navigateToIntegration(integrationName);
            return;
          }

          const payload = {
            callbackUrl: integrationCallbackUrlMap[accountingIntegrationApp][0],
            clientId: integrationCallbackUrlMap[accountingIntegrationApp][1]
          };

          console.log({payload})

          this.eventsService.postEvent(payload);
        }
      });
    }


    if (this.isDisconnectRequired) {
      options[0].items.push(
        {
          label: '[divider]',
          disabled: true
        },
        {
          label: 'Disconnect',
          handler: () => {
            this.disconnect();
          }
        }
      );
    }

    this.dropdownOptions = options;
  }

  ngOnInit(): void {
    if (brandingConfig.brandId === 'fyle') {
      this.integrationsService.getIntegrations().subscribe(integrations => {
        this.addDropdownOptions(integrations);
      });
    }
  }
}

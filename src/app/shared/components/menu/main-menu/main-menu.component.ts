import { Component, EventEmitter, Input, OnInit, Output, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, IframeOrigin, InAppIntegration } from 'src/app/core/models/enum/enum.model';
import { Integration } from 'src/app/core/models/integrations/integrations.model';
import { MainMenuDropdownGroup } from 'src/app/core/models/misc/main-menu-dropdown-options';
import { trackingAppMap } from 'src/app/core/models/misc/tracking.model';
import { EventsService } from 'src/app/core/services/common/events.service';
import { IntegrationsService } from 'src/app/core/services/common/integrations.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { IframeOriginStorageService } from 'src/app/core/services/misc/iframe-origin-storage.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() activeItem: MenuItem;

  @Input() dropdownValue = null;

  @Input() appName: AppName;

  @Input() isDropdrownRequired: boolean;

  @Input() isSyncVisible: boolean;

  @Input() isDisconnectRequired: boolean = false;

  @Input() isConnectionInProgress: boolean;

  @Input() toolTipText: string;

  @Output() refreshDimensionClick = new EventEmitter<boolean>();

  @Output() disconnectClick = new EventEmitter();

  private pDropdown = viewChild(Dropdown);

  isMenuDisabled: boolean = false;

  dropdownOptions: MainMenuDropdownGroup[];

  isDisabled: boolean = false;

  showMoreDropdown: boolean;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private router: Router,
    private integrationsService: IntegrationsService,
    private eventsService: EventsService,
    private iframeOriginStorageService: IframeOriginStorageService,
    private trackingService: TrackingService
  ) {
    this.showMoreDropdown =
      this.brandingFeatureConfig.showMoreDropdownInMainMenu &&
      this.iframeOriginStorageService.get() === IframeOrigin.ADMIN_DASHBOARD;
  }

  handleDropdownChange(event: any) {
    if (event.value === null) {
      return;
    }

    event.value.handler();
    this.pDropdown()?.clear();

    this.trackingService.onDropDownItemClick(
      trackingAppMap[this.appName],
      { option: event.value.label }
    );
  }

  handleDropdownClick() {
    this.trackingService.onDropDownOpen(trackingAppMap[this.appName]);
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
     * at integrations[0] should be unshifted last (to make it the first option)
     */
    for (let i = integrations.length - 1; i >= 0; i--) {
      const integration = integrations[i];
      const integrationName = this.integrationsService.getIntegrationName(integration.tpa_name);
      const existingOptions = options[0].items.map(i => i.label);
      if (integrationName === null || existingOptions.includes(integrationName)) {
        continue;
      }

      options[0].items.unshift({
        label: integrationName,
        handler: () => {
          this.integrationsService.navigateToIntegration(integrationName);
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

    if (!this.toolTipText) {
      this.toolTipText = 'The integration will import all the newly updated ' + this.appName + ' dimensions and ' + brandingConfig.brandName + ' expenses in the configured state of export';
    }

    if (this.router.url.includes("/token_expired/")){
      this.isMenuDisabled = true;
      this.modules = this.modules.map(item => ({
        ...item,
        disabled: item.disabled !== undefined ? item.disabled : this.isMenuDisabled
      }));
      
    }
  }
}

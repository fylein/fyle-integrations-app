import { Component, EventEmitter, Input, OnInit, Output, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { MenuItem } from 'primeng/api';
import { Select } from 'primeng/select';
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
    styleUrls: ['./main-menu.component.scss'],
    standalone: false
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

  private pDropdown = viewChild(Select);

  isMenuDisabled: boolean = false;

  dropdownOptions: MainMenuDropdownGroup[];

  isDisabled: boolean = false;

  showMoreDropdown: boolean;

  activeTabValue: string = '0';

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private router: Router,
    private integrationsService: IntegrationsService,
    private eventsService: EventsService,
    private iframeOriginStorageService: IframeOriginStorageService,
    private trackingService: TrackingService,
    private translocoService: TranslocoService
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

  navigateToModule(module: MenuItem): void {
    if (module.routerLink && !module.disabled) {
      if (Array.isArray(module.routerLink)) {
        this.router.navigate(module.routerLink);
      } else {
        this.router.navigateByUrl(module.routerLink);
      }
    }
  }

  isCurrentIntegration(integrationName: InAppIntegration) {
    return this.router.url.includes(
      this.integrationsService.inAppIntegrationUrlMap[integrationName]
    );
  }

  private calculateActiveTab(): void {
    if (this.modules && this.modules.length > 0) {
      const currentUrl = this.router.url;

      // Find the active tab based on the current route
      const activeIndex = this.modules.findIndex(module => {
        if (module.routerLink) {
          // Handle array of route segments
          if (Array.isArray(module.routerLink)) {
            return currentUrl.includes(module.routerLink.join('/'));
          }
          // Handle string route
          return currentUrl.includes(module.routerLink);
        }
        return false;
      });

      this.activeTabValue = activeIndex >= 0 ? activeIndex.toString() : '0';
    }
  }

  private addDropdownOptions(integrations: Integration[]) {
    const options: MainMenuDropdownGroup[] = [
      {
        label: this.translocoService.translate('mainMenu.integrations'),
        items: [
          {
            label: this.translocoService.translate('mainMenu.addMoreIntegrations'),
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
          if (!this.isCurrentIntegration(integrationName)) {
            this.integrationsService.navigateToIntegration(integrationName);
          }
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
          label: this.translocoService.translate('mainMenu.disconnect'),
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
      this.toolTipText = this.translocoService.translate('mainMenu.syncTooltip', { appName: this.appName, brandName: brandingConfig.brandName });
    }

    if (this.router.url.includes("/token_expired/") || this.router.url.includes("/disconnect/")){
      this.isMenuDisabled = true;
      this.isDisconnectRequired = false;
      this.modules = this.modules.map(item => ({
        ...item,
        disabled: item.disabled !== undefined ? item.disabled : this.isMenuDisabled
      }));
    }

    // Calculate the active tab based on current route
    this.calculateActiveTab();

    // Listen to route changes to update active tab
    this.router.events.subscribe(() => {
      this.calculateActiveTab();
    });
  }
}

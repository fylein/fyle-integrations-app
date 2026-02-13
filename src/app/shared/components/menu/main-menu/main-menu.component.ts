import { Component, EventEmitter, Input, OnInit, Output, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Select } from 'primeng/select';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { AppName, ButtonSize, ButtonType, IframeOrigin, InAppIntegration } from 'src/app/core/models/enum/enum.model';
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

  @Input() modules: TabMenuItem[];

  @Input() activeItem: string;

  @Input() dropdownValue = null;

  @Input() appName: AppName;

  @Input() isDropdrownRequired: boolean;

  @Input() isSyncVisible: boolean;

  @Input() isDisconnectRequired: boolean = false;

  @Input() isConnectionInProgress: boolean;

  @Input() toolTipText: string;

  @Input() styleClasses: string = '';

  @Input() useMainMenuForSubmenu: boolean = false;

  @Output() refreshDimensionClick = new EventEmitter<boolean>();

  @Output() disconnectClick = new EventEmitter();

  private pDropdown = viewChild(Select);

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  isMenuDisabled: boolean = false;

  dropdownOptions: MainMenuDropdownGroup[];

  isDisabled: boolean = false;

  showMoreDropdown: boolean;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

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

  onTabChange(value: string | number | undefined){
    if (!value) {
      return;
    }
    const stringValue = String(value);
    this.activeItem = stringValue;
    const selectedModule = this.modules.find(m => m.value === stringValue);
    if (selectedModule?.routerLink) {
      this.router.navigate([selectedModule.routerLink]);
    }
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

  getCurrentIntegrationName(): string | undefined {
    const integrations = Object.keys(this.integrationsService.inAppIntegrationUrlMap) as InAppIntegration[];
    return integrations.find(integration => this.isCurrentIntegration(integration));
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

    const activeModule = this.modules.find(module => this.router.url.includes(module.routerLink || '')) || this.modules[0];
    this.activeItem = activeModule.value;

    // Navigate to the active module for routes like:
    // /integrations/qbo/main/configuration -> /integrations/qbo/main/configuration/export_settings
    if (activeModule.routerLink && activeModule.routerLink.includes(this.router.url)) {
      this.router.navigateByUrl(activeModule.routerLink);
    }

    if (this.router.url.includes("/token_expired/") || this.router.url.includes("/disconnect/")){
      this.isMenuDisabled = true;
      this.isDisconnectRequired = false;
    }
  }
}

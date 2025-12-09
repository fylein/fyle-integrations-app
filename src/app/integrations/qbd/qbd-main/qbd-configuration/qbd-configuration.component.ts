import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ClickEvent, Page } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-configuration',
  templateUrl: './qbd-configuration.component.html',
  styleUrls: ['./qbd-configuration.component.scss'],
  standalone: false,
})
export class QbdConfigurationComponent implements OnInit {
  modules: TabMenuItem[];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.modules = [
      {
        label: this.translocoService.translate('qbdConfiguration.exportSettings'),
        routerLink: '/integrations/qbd/main/configuration/export_settings',
        value: 'export_settings',
      },
      {
        label: this.translocoService.translate('qbdConfiguration.fieldMapping'),
        routerLink: '/integrations/qbd/main/configuration/field_mapping',
        value: 'field_mapping',
      },
      {
        label: this.translocoService.translate('qbdConfiguration.advancedSettings'),
        routerLink: '/integrations/qbd/main/configuration/advanced_settings',
        value: 'advanced_settings',
      },
    ];
    this.activeModule = this.modules[0].value;
    this.router.navigateByUrl(this.modules[0].routerLink!);
  }
}

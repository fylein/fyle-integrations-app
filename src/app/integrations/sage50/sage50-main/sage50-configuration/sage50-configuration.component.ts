import { Component, OnInit } from '@angular/core';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sage50-configuration',
  imports: [SharedModule, RouterOutlet],
  templateUrl: './sage50-configuration.component.html',
  styleUrls: ['./sage50-configuration.component.scss'],
})
export class Sage50ConfigurationComponent implements OnInit {
  modules: TabMenuItem[] = [];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private translocoService: TranslocoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.modules = [
      {
        label: this.translocoService.translate('sage50Configuration.exportSettings'),
        routerLink: '/integrations/sage50/main/configuration/export_settings',
        value: 'export_settings',
      },
      {
        label: this.translocoService.translate('sage50Configuration.importSettings'),
        routerLink: '/integrations/sage50/main/configuration/import_settings',
        value: 'import_settings',
      },
      {
        label: this.translocoService.translate('sage50Configuration.advancedSettings'),
        routerLink: '/integrations/sage50/main/configuration/advanced_settings',
        value: 'advanced_settings',
      },
    ];

    this.activeModule = this.modules[0].value;
    this.router.navigateByUrl(this.modules[0].routerLink!);
  }
}

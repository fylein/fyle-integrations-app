import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sage50-configuration',
  standalone: true,
  imports: [SharedModule, RouterOutlet],
  templateUrl: './sage50-configuration.component.html',
  styleUrls: ['./sage50-configuration.component.scss']
})
export class Sage50ConfigurationComponent implements OnInit {

  modules: MenuItem[] = [];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('sage50Configuration.exportSettings'), routerLink: '/integrations/sage50/main/configuration/export_settings'},
      {label: this.translocoService.translate('sage50Configuration.importSettings'), routerLink: '/integrations/sage50/main/configuration/import_settings'},
      {label: this.translocoService.translate('sage50Configuration.advancedSettings'), routerLink: '/integrations/sage50/main/configuration/advanced_settings'}
    ];

    this.activeModule = this.modules[0];
  }

}

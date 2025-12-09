import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-sage300-export-log',
  templateUrl: './sage300-export-log.component.html',
  styleUrls: ['./sage300-export-log.component.scss'],
  standalone: false,
})
export class Sage300ExportLogComponent implements OnInit {
  isLoading: boolean = false;

  modules: TabMenuItem[];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.modules = [
      {
        label: this.translocoService.translate('sage300ExportLog.completed'),
        routerLink: '/integrations/sage300/main/export_log/complete_export_log',
        value: 'complete_export_log',
      },
      {
        label: this.translocoService.translate('sage300ExportLog.skipped'),
        routerLink: '/integrations/sage300/main/export_log/skip_export_log',
        value: 'skip_export_log',
      },
    ];
    this.activeModule = this.modules[0].value;
    this.router.navigateByUrl(this.modules[0].routerLink as string);
  }
}

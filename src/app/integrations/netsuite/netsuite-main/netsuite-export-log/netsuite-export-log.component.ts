import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingFeatureConfig, brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-netsuite-export-log',
  templateUrl: './netsuite-export-log.component.html',
  styleUrls: ['./netsuite-export-log.component.scss'],
  standalone: false,
})
export class NetsuiteExportLogComponent implements OnInit {
  modules: TabMenuItem[];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.modules = [
      {
        label: this.translocoService.translate('netsuiteExportLog.completed'),
        routerLink: '/integrations/netsuite/main/export_log/complete',
        value: 'complete',
      },
      {
        label: this.translocoService.translate('netsuiteExportLog.skipped'),
        routerLink: '/integrations/netsuite/main/export_log/skipped',
        value: 'skipped',
      },
    ];
    this.activeModule = this.modules[0].value;
    this.router.navigateByUrl(this.modules[0].routerLink!);
  }
}

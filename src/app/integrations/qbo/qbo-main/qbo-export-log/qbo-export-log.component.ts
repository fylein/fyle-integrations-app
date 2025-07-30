import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-qbo-export-log',
    templateUrl: './qbo-export-log.component.html',
    styleUrls: ['./qbo-export-log.component.scss'],
    standalone: false
})
export class QboExportLogComponent implements OnInit {

  modules: MenuItem[];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) { }


  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('qboExportLog.completed'), routerLink: '/integrations/qbo/main/export_log/complete'},
      {label: this.translocoService.translate('qboExportLog.skipped'), routerLink: '/integrations/qbo/main/export_log/skipped'}
    ];
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}

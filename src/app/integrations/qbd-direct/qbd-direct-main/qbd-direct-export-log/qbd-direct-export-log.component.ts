import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/c1-content-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-direct-export-log',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule, TranslocoModule],
  templateUrl: './qbd-direct-export-log.component.html',
  styleUrl: './qbd-direct-export-log.component.scss'
})
export class QbdDirectExportLogComponent implements OnInit {

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
      {label: this.translocoService.translate('qbdDirectExportLog.completed'), routerLink: '/integrations/qbd_direct/main/export_log/complete'},
      {label: this.translocoService.translate('qbdDirectExportLog.skipped'), routerLink: '/integrations/qbd_direct/main/export_log/skipped'}
    ];
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }


}

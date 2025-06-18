import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-direct-main',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule, TranslocoModule],
  templateUrl: './qbd-direct-main.component.html',
  styleUrl: './qbd-direct-main.component.scss'
})
export class QbdDirectMainComponent {

  appName: AppName = AppName.QBD_DIRECT;

  readonly brandingContent = brandingContent.common;

  modules: MenuItem[];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private qbdDirectHelperService: QbdDirectHelperService,
    private translocoService: TranslocoService
  ) { 
    this.modules = [
      {label: this.translocoService.translate('qbdDirectMain.dashboard'), routerLink: '/integrations/qbd_direct/main/dashboard'},
      {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/qbd_direct/main/export_log'},
      {label: this.translocoService.translate('qbdDirectMain.mapping'), routerLink: '/integrations/qbd_direct/main/mapping'},
      {label: this.translocoService.translate('qbdDirectMain.configuration'), routerLink: '/integrations/qbd_direct/main/configuration'}
    ];
  }

  refreshDimensions() {
    this.qbdDirectHelperService.importAttributes(true);
  }
}

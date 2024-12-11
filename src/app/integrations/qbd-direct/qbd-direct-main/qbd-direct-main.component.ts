import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-main',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule],
  templateUrl: './qbd-direct-main.component.html',
  styleUrl: './qbd-direct-main.component.scss'
})
export class QbdDirectMainComponent implements OnInit {

  appName: AppName = AppName.QBD_DIRECT;

  readonly brandingContent = brandingContent.common;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/qbd_direct/main/dashboard'},
    {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/qbd_direct/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/qbd_direct/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/qbd_direct/main/configuration'}
  ];

  activeModule: MenuItem;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private qbdDirectHelperService: QbdDirectHelperService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }


  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

  refreshDimensions() {
    this.workspaceService.importFyleAttributes(true).subscribe();
    this.qbdDirectHelperService.importQBDAttributes(true).subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from QuickBooks Desktop');
  }

  ngOnInit(): void {
    this.setupPage();
  }
}

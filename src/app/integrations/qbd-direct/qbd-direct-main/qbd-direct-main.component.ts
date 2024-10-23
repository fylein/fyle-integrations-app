import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
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
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }


  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

  refreshDimensions() {
    this.workspaceService.importFyleAttributes(true).subscribe();
  }

  ngOnInit(): void {
    this.setupPage();
  }
}

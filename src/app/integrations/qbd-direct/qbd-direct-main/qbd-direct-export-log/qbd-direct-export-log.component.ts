import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/c1-contents-config';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-export-log',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule],
  templateUrl: './qbd-direct-export-log.component.html',
  styleUrl: './qbd-direct-export-log.component.scss'
})
export class QbdDirectExportLogComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Completed', routerLink: '/integrations/qbd_direct/main/export_log/complete'},
    {label: 'Skipped', routerLink: '/integrations/qbd_direct/main/export_log/skipped'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }


}

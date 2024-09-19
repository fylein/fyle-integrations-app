import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-business-central-export-log',
  templateUrl: './business-central-export-log.component.html',
  styleUrls: ['./business-central-export-log.component.scss']
})
export class BusinessCentralExportLogComponent implements OnInit {

  isLoading: boolean = false;

  modules: MenuItem[] = [
    { label: 'Completed', routerLink: '/integrations/business_central/main/export_log/complete_export_log' },
    { label: 'Skipped', routerLink: '/integrations/business_central/main/export_log/skip_export_log' }
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}

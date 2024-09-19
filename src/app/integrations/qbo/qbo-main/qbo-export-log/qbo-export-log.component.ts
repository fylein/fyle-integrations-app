import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-qbo-export-log',
  templateUrl: './qbo-export-log.component.html',
  styleUrls: ['./qbo-export-log.component.scss']
})
export class QboExportLogComponent implements OnInit {

  modules: MenuItem[] = [
    { label: 'Completed', routerLink: '/integrations/qbo/main/export_log/complete' },
    { label: 'Skipped', routerLink: '/integrations/qbo/main/export_log/skipped' }
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}

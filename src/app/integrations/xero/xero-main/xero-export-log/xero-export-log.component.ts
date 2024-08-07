import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-xero-export-log',
  templateUrl: './xero-export-log.component.html',
  styleUrls: ['./xero-export-log.component.scss']
})
export class XeroExportLogComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Completed', routerLink: '/integrations/xero/main/export_log/complete'}
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

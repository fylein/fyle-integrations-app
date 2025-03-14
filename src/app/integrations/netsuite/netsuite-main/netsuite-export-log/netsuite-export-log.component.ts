import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig, brandingConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-netsuite-export-log',
  templateUrl: './netsuite-export-log.component.html',
  styleUrls: ['./netsuite-export-log.component.scss']
})
export class NetsuiteExportLogComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Completed', routerLink: '/integrations/netsuite/main/export_log/complete'},
    {label: 'Skipped', routerLink: '/integrations/netsuite/main/export_log/skipped'}
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

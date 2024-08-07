import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-intacct-export-log',
  templateUrl: './intacct-export-log.component.html',
  styleUrls: ['./intacct-export-log.component.scss']
})
export class IntacctExportLogComponent implements OnInit {

  isLoading: boolean = false;

  modules: MenuItem[] = [
    {label: 'Completed', routerLink: '/integrations/intacct/main/export_log/complete'},
    {label: 'Skipped', routerLink: '/integrations/intacct/main/export_log/skipped'}
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

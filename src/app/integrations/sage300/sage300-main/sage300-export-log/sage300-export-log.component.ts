import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-sage300-export-log',
  templateUrl: './sage300-export-log.component.html',
  styleUrls: ['./sage300-export-log.component.scss']
})
export class Sage300ExportLogComponent implements OnInit {

  isLoading: boolean = false;

  modules: MenuItem[] = [
    {label: 'Completed', routerLink: '/integrations/sage300/main/export_log/complete_export_log'},
    {label: 'Skipped', routerLink: '/integrations/sage300/main/export_log/skip_export_log'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}

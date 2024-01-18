import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-export-log',
  templateUrl: './export-log.component.html',
  styleUrls: ['./export-log.component.scss']
})
export class ExportLogComponent implements OnInit {

  isLoading: boolean = false;

  modules: MenuItem[] = [
    {label: 'Completed', routerLink: '/integrations/intacct/main/export_log/complete_export_log'},
    {label: 'Skipped', routerLink: '/integrations/intacct/main/export_log/skip_export_log'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}

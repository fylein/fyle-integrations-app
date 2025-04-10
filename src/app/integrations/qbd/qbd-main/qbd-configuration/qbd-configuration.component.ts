import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ClickEvent, Page } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-qbd-configuration',
  templateUrl: './qbd-configuration.component.html',
  styleUrls: ['./qbd-configuration.component.scss']
})
export class QbdConfigurationComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Export settings', routerLink: '/integrations/qbd/main/configuration/export_settings'},
    {label: 'Field mapping', routerLink: '/integrations/qbd/main/configuration/field_mapping'},
    {label: 'Advanced settings', routerLink: '/integrations/qbd/main/configuration/advanced_settings'}
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
